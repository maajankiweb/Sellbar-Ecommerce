'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDeliveryTracking, DeliveryLocation } from '@/hooks/useDeliveryTracking';
import {
  Navigation,
  MapPin,
  Clock,
  Radio,
  Bell,
  CheckCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  ShieldAlert,
} from 'lucide-react';

interface DestinationPoint {
  lat: number;
  lng: number;
  address: string;
}

interface LiveTrackingMapProps {
  orderId: string;
  destination: DestinationPoint;
  initialDeliveryLocation?: { lat: number; lng: number };
  authToken?: string;
}

// Calculate Haversine Distance (Kilometers)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate Heading Angle in degrees
function getBearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  const y = Math.sin((destLng - startLng) * (Math.PI / 180)) * Math.cos(destLat * (Math.PI / 180));
  const x =
    Math.cos(startLat * (Math.PI / 180)) * Math.sin(destLat * (Math.PI / 180)) -
    Math.sin(startLat * (Math.PI / 180)) *
      Math.cos(destLat * (Math.PI / 180)) *
      Math.cos((destLng - startLng) * (Math.PI / 180));
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Web Audio API synthesizer for the melodic 500m arrival chime
 * Zero external audio files required
 */
function playSyntheticArrivalChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Melodic sequence: D5 (587Hz) -> A5 (880Hz) -> D6 (1174Hz)
    playTone(587.33, 0.0, 0.35);
    playTone(880.0, 0.18, 0.45);
    playTone(1174.66, 0.38, 0.85);
  } catch (err) {
    console.warn('[Audio] Could not play arrival chime:', err);
  }
}

export default function LiveTrackingMap({
  orderId,
  destination,
  initialDeliveryLocation,
  authToken,
}: LiveTrackingMapProps) {
  const { location, isConnected } = useDeliveryTracking(orderId, authToken);

  // Position state with linear interpolation
  const [currentCoord, setCurrentCoord] = useState<{ lat: number; lng: number }>(
    initialDeliveryLocation || {
      lat: destination.lat - 0.015,
      lng: destination.lng - 0.012,
    }
  );

  const targetCoordRef = useRef<{ lat: number; lng: number }>(currentCoord);
  const [heading, setHeading] = useState<number>(45);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zoom, setZoom] = useState(15);
  const chimeTriggeredRef = useRef(false);

  // When live GPS update arrives from Socket.IO, update the target position
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      targetCoordRef.current = {
        lat: location.latitude,
        lng: location.longitude,
      };
      if (location.heading !== undefined) {
        setHeading(location.heading);
      }
    }
  }, [location]);

  // RequestAnimationFrame Smooth Marker Interpolation Loop
  useEffect(() => {
    let animId: number;

    const interpolate = () => {
      setCurrentCoord((prev) => {
        const target = targetCoordRef.current;
        const dLat = target.lat - prev.lat;
        const dLng = target.lng - prev.lng;

        // If distance is very small, snap to target
        if (Math.abs(dLat) < 0.000001 && Math.abs(dLng) < 0.000001) {
          return target;
        }

        // LERP factor (0.08 for smooth glide)
        const lerpFactor = 0.08;
        const newLat = prev.lat + dLat * lerpFactor;
        const newLng = prev.lng + dLng * lerpFactor;

        // Auto-orient heading towards motion
        if (Math.abs(dLat) > 0.00001 || Math.abs(dLng) > 0.00001) {
          const newBearing = getBearing(prev.lat, prev.lng, target.lat, target.lng);
          setHeading(newBearing);
        }

        return { lat: newLat, lng: newLng };
      });

      animId = requestAnimationFrame(interpolate);
    };

    animId = requestAnimationFrame(interpolate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Distance & ETA calculation
  const distanceKm = getDistanceKm(
    currentCoord.lat,
    currentCoord.lng,
    destination.lat,
    destination.lng
  );
  const etaMinutes = Math.max(1, Math.round((distanceKm / 22) * 60)); // Avg 22km/h city bike speed
  const isNearArrival = distanceKm <= 0.5;

  // Sound chime trigger when courier enters the 500m perimeter
  useEffect(() => {
    if (isNearArrival && !chimeTriggeredRef.current) {
      chimeTriggeredRef.current = true;
      if (soundEnabled) {
        playSyntheticArrivalChime();
      }
    } else if (!isNearArrival) {
      chimeTriggeredRef.current = false;
    }
  }, [isNearArrival, soundEnabled]);

  // Handle native WebPush subscription activation
  const handleEnablePush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Push notifications are not supported in this browser.');
      return;
    }

    setPushLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission was denied.');
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const vapidPublicKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

      // Base64 to Uint8Array converter
      const rawData = window.atob(vapidPublicKey.replace(/-/g, '+').replace(/_/g, '/'));
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray,
      });

      await fetch('/api/v1/notifications/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          orderId,
        }),
      });

      setPushSubscribed(true);
    } catch (err: any) {
      console.error('Failed to subscribe to push:', err);
    } finally {
      setPushLoading(false);
    }
  };

  // Convert GPS coordinates into dynamic map canvas projections
  const mapCenterLat = (currentCoord.lat + destination.lat) / 2;
  const mapCenterLng = (currentCoord.lng + destination.lng) / 2;

  const scale = Math.pow(2, zoom - 12) * 5000;

  const getCanvasOffset = (lat: number, lng: number) => {
    const x = 50 + (lng - mapCenterLng) * scale;
    const y = 50 - (lat - mapCenterLat) * scale;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
      numX: Math.max(5, Math.min(95, x)),
      numY: Math.max(5, Math.min(95, y)),
    };
  };

  const deliveryPos = getCanvasOffset(currentCoord.lat, currentCoord.lng);
  const destPos = getCanvasOffset(destination.lat, destination.lng);

  // 500m geofence radius in projection coordinates (0.5 km ~= 0.0045 degrees lat)
  const geofenceRadiusPercent = Math.max(12, Math.min(45, 0.0045 * scale));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Courier Tracking</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {isConnected ? 'Socket Active' : 'Connecting...'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Order #{orderId}</p>
          </div>
        </div>

        {/* ETA & Distance Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">ETA ~{etaMinutes} mins</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Radio className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-200">{distanceKm.toFixed(2)} km away</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Arrival Chime Enabled' : 'Mute Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {!pushSubscribed ? (
            <button
              onClick={handleEnablePush}
              disabled={pushLoading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition"
            >
              <Bell className="w-3.5 h-3.5" />
              {pushLoading ? 'Enabling...' : '500m Push Alert'}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5" />
              Proximity Alert Armed
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="h-80 md:h-96 w-full relative bg-slate-950 overflow-hidden">
        {/* OpenStreetMap / Carto Dark Tile Layer Simulation */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#334155 1px, transparent 1px), radial-gradient(#1e293b 1px, #020617 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* SVG Canvas for Geofencing Polygon & Route Polyline */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="geofenceGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* 500m Geofencing Radial Fill Area */}
          <circle
            cx={destPos.numX}
            cy={destPos.numY}
            r={geofenceRadiusPercent}
            fill="url(#geofenceGlow)"
          />

          {/* 500m Geofencing Boundary Line */}
          <circle
            cx={destPos.numX}
            cy={destPos.numY}
            r={geofenceRadiusPercent}
            fill="none"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
          />

          {/* Radar Wave Pulse around 500m Geofence */}
          <circle
            cx={destPos.numX}
            cy={destPos.numY}
            r={geofenceRadiusPercent * 1.08}
            fill="none"
            stroke="#34d399"
            strokeWidth="0.25"
            opacity="0.5"
            strokeDasharray="1 1"
          />

          {/* Dynamic Route Polyline */}
          <line
            x1={deliveryPos.numX}
            y1={deliveryPos.numY}
            x2={destPos.numX}
            y2={destPos.numY}
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
          />
        </svg>

        {/* 500m Geofence Perimeter Floating Tag */}
        <div
          className="absolute z-15 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: destPos.left,
            top: `calc(${destPos.top} - ${geofenceRadiusPercent * 0.9}%)`,
          }}
        >
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
            <ShieldAlert className="w-2.5 h-2.5" />
            500m Geofence Perimeter
          </span>
        </div>

        {/* Delivery Partner Interpolated Marker */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
          style={{ left: deliveryPos.left, top: deliveryPos.top }}
        >
          <div className="relative group cursor-pointer">
            <div
              className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 border-2 border-white transition-transform duration-300"
              style={{ transform: `rotate(${heading}deg)` }}
            >
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap shadow-lg">
              Delivery Executive (~{distanceKm.toFixed(1)} km)
            </div>
          </div>
        </div>

        {/* Customer Destination Marker */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: destPos.left, top: destPos.top }}
        >
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 border-2 border-white animate-bounce">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap shadow-lg">
              Your Doorstep
            </div>
          </div>
        </div>

        {/* Proximity 500m Alert Banner */}
        {isNearArrival && (
          <div className="absolute top-4 left-4 z-20 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Courier has entered the 500m geofence! Please keep your OTP ready.
          </div>
        )}

        {/* Map Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(18, z + 1))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(10, z - 1))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Address Details */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="truncate">Delivering to: <strong className="text-slate-200">{destination.address}</strong></span>
        </div>
        <span className="shrink-0 text-slate-500 font-mono text-[11px]">
          GPS: {currentCoord.lat.toFixed(4)}, {currentCoord.lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
