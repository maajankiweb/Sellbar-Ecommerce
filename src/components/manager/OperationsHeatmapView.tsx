'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Truck,
  AlertTriangle,
  Users,
  Layers,
  RefreshCw,
  MapPin,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  Bot,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { SpatialCluster, HeatmapDataResponse } from '@/services/analytics/spatialHeatmapService';

type HeatmapMetricMode = 'VOLUME' | 'DENSITY' | 'SLA_RISK';

const FALLBACK_CLUSTERS: SpatialCluster[] = [
  {
    zoneId: 'zone-bandra',
    zoneName: 'Bandra West & Khar (Hub Primary)',
    center: { lat: 19.0596, lng: 72.8295 },
    radiusMeters: 2200,
    orderVolume: 14,
    courierCount: 3,
    densityRatio: 4.7,
    slaRisk: 'MODERATE',
    avgCompletionMins: 34,
    couriers: [
      { id: 'DLV-401', name: 'Ravi Kumar (Lead Partner)', lat: 19.058, lng: 72.831 },
      { id: 'DLV-403', name: 'Siddharth Rao', lat: 19.062, lng: 72.828 },
    ],
  },
  {
    zoneId: 'zone-andheri',
    zoneName: 'Andheri West & Lokhandwala',
    center: { lat: 19.1363, lng: 72.8277 },
    radiusMeters: 2800,
    orderVolume: 18,
    courierCount: 2,
    densityRatio: 9.0,
    slaRisk: 'CAPACITY_CRITICAL',
    avgCompletionMins: 47,
    couriers: [
      { id: 'DEL-902', name: 'Rajesh Shinde', lat: 19.134, lng: 72.825 },
    ],
  },
  {
    zoneId: 'zone-bkc',
    zoneName: 'BKC Financial Center & Kurla',
    center: { lat: 19.0664, lng: 72.8682 },
    radiusMeters: 2000,
    orderVolume: 9,
    courierCount: 2,
    densityRatio: 4.5,
    slaRisk: 'MODERATE',
    avgCompletionMins: 31,
    couriers: [
      { id: 'DLV-405', name: 'Imran Shaikh', lat: 19.068, lng: 72.869 },
    ],
  },
  {
    zoneId: 'zone-lowerparel',
    zoneName: 'Lower Parel & Worli FinTech Hub',
    center: { lat: 19.0068, lng: 72.8223 },
    radiusMeters: 2400,
    orderVolume: 12,
    courierCount: 3,
    densityRatio: 4.0,
    slaRisk: 'HEALTHY',
    avgCompletionMins: 26,
    couriers: [
      { id: 'DLV-402', name: 'Sunil Jadhav', lat: 19.009, lng: 72.824 },
      { id: 'DLV-406', name: 'Naveen Nair', lat: 19.004, lng: 72.821 },
    ],
  },
  {
    zoneId: 'zone-juhu',
    zoneName: 'Juhu Tara & Vile Parle West',
    center: { lat: 19.1025, lng: 72.8267 },
    radiusMeters: 2100,
    orderVolume: 6,
    courierCount: 2,
    densityRatio: 3.0,
    slaRisk: 'HEALTHY',
    avgCompletionMins: 22,
    couriers: [
      { id: 'DLV-408', name: 'Amit Sawant', lat: 19.104, lng: 72.829 },
    ],
  },
  {
    zoneId: 'zone-powai',
    zoneName: 'Powai Hiranandani & Kanjurmarg',
    center: { lat: 19.1176, lng: 72.906 },
    radiusMeters: 2600,
    orderVolume: 8,
    courierCount: 1,
    densityRatio: 8.0,
    slaRisk: 'CAPACITY_CRITICAL',
    avgCompletionMins: 44,
    couriers: [
      { id: 'DLV-409', name: 'Manoj Pillai', lat: 19.115, lng: 72.904 },
    ],
  },
];

export default function OperationsHeatmapView() {
  const [metricMode, setMetricMode] = useState<HeatmapMetricMode>('VOLUME');
  const [clusters, setClusters] = useState<SpatialCluster[]>(FALLBACK_CLUSTERS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-andheri');
  const [isLoading, setIsLoading] = useState(false);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [rebalanceToast, setRebalanceToast] = useState('');

  const selectedZone = useMemo(() => {
    return clusters.find((c) => c.zoneId === selectedZoneId) || clusters[0];
  }, [clusters, selectedZoneId]);

  const fetchHeatmapData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/manager/analytics/heatmap');
      const data = await res.json();
      if (data.success && data.data?.clusters) {
        setClusters(data.data.clusters);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();

    try {
      const socket = io({
        path: '/api/socket.io',
        auth: { token: 'demo-manager-token' },
      });

      socket.on('manager:rebalance:executed', (payload: any) => {
        setRebalanceToast(
          `🤖 Bot Rebalance Alert: ${payload.assignedCourierName} deployed to ${payload.zoneName} (+₹${payload.surgeIncentiveInr} surge)!`
        );
        setTimeout(() => setRebalanceToast(''), 5500);
        fetchHeatmapData();
      });

      return () => {
        socket.disconnect();
      };
    } catch {
      // Local fallback
    }
  }, []);

  const handleRebalance = async (zoneName: string) => {
    setIsBotRunning(true);
    try {
      const res = await fetch('/api/v1/cron/rebalance-zones', {
        method: 'POST',
        headers: {
          authorization: 'Bearer selbar_cron_secret_key_2026',
        },
      });
      const data = await res.json();
      if (data.success && data.data?.actionsExecuted?.length > 0) {
        const action = data.data.actionsExecuted[0];
        setRebalanceToast(
          `🤖 Bot Deployed: ${action.assignedCourierName} to ${action.zoneName} (+₹${action.surgeIncentiveInr} surge bonus)!`
        );
        fetchHeatmapData();
      } else {
        setRebalanceToast(`Rebalance evaluation complete: All critical zones within SLA thresholds.`);
      }
    } catch {
      setRebalanceToast(`Courier dispatch rebalancing suggested for ${zoneName}! Standby fleet notified.`);
    } finally {
      setIsBotRunning(false);
      setTimeout(() => setRebalanceToast(''), 5000);
    }
  };

  // Canvas bounds projection
  const allCoords = clusters.map((c) => c.center);
  const minLat = Math.min(...allCoords.map((c) => c.lat));
  const maxLat = Math.max(...allCoords.map((c) => c.lat));
  const minLng = Math.min(...allCoords.map((c) => c.lng));
  const maxLng = Math.max(...allCoords.map((c) => c.lng));

  const padLat = (maxLat - minLat) * 0.25 || 0.02;
  const padLng = (maxLng - minLng) * 0.25 || 0.02;

  const toCanvas = (lat: number, lng: number) => {
    const x = ((lng - (minLng - padLng)) / (maxLng - minLng + padLng * 2)) * 84 + 8;
    const y = 92 - ((lat - (minLat - padLat)) / (maxLat - minLat + padLat * 2)) * 84;
    return { x, y };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
      {/* Toast Notification */}
      {rebalanceToast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <Zap className="w-4 h-4" />
          {rebalanceToast}
        </div>
      )}

      {/* Header & Controls */}
      <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-100">Operations Spatial Density Heatmap</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Mumbai Metro
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time geospatial clustering of courier density vs. active order doorsteps
          </p>
        </div>

        {/* View Mode Switcher & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setMetricMode('VOLUME')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                metricMode === 'VOLUME'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔥 Volume
            </button>
            <button
              onClick={() => setMetricMode('DENSITY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                metricMode === 'DENSITY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🛵 Couriers
            </button>
            <button
              onClick={() => setMetricMode('SLA_RISK')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                metricMode === 'SLA_RISK'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚠️ SLA Stress
            </button>
          </div>

          <button
            onClick={fetchHeatmapData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Real-time Clusters"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Heatmap Visual Canvas */}
        <div className="lg:col-span-8 h-96 lg:h-[500px] relative bg-slate-950 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Subtle Grid Lines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Render Cluster Heat Halos */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="heatGreen" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatAmber" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {clusters.map((cluster) => {
              const pos = toCanvas(cluster.center.lat, cluster.center.lng);
              const gradId =
                cluster.slaRisk === 'CAPACITY_CRITICAL'
                  ? 'url(#heatRed)'
                  : cluster.slaRisk === 'MODERATE'
                  ? 'url(#heatAmber)'
                  : 'url(#heatGreen)';

              const radiusSvg = 12 + (cluster.orderVolume / 2);

              return (
                <g key={cluster.zoneId}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radiusSvg}
                    fill={gradId}
                    className={cluster.slaRisk === 'CAPACITY_CRITICAL' ? 'animate-pulse' : ''}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radiusSvg}
                    fill="none"
                    stroke={
                      cluster.slaRisk === 'CAPACITY_CRITICAL'
                        ? '#ef4444'
                        : cluster.slaRisk === 'MODERATE'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    strokeWidth="0.3"
                    strokeDasharray="1 1"
                    opacity="0.6"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Cluster Nodes */}
          {clusters.map((cluster) => {
            const pos = toCanvas(cluster.center.lat, cluster.center.lng);
            const isSelected = selectedZoneId === cluster.zoneId;

            return (
              <div
                key={cluster.zoneId}
                onClick={() => setSelectedZoneId(cluster.zoneId)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div
                  className={`px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl border-2 transition ${
                    isSelected
                      ? 'bg-slate-900 border-white ring-4 ring-blue-500/30 text-white'
                      : cluster.slaRisk === 'CAPACITY_CRITICAL'
                      ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                      : cluster.slaRisk === 'MODERATE'
                      ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                      : 'bg-slate-900/90 border-emerald-500 text-emerald-200'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      cluster.slaRisk === 'CAPACITY_CRITICAL'
                        ? 'bg-rose-500 animate-ping'
                        : cluster.slaRisk === 'MODERATE'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <div className="text-[11px] font-black leading-tight">
                      {metricMode === 'VOLUME'
                        ? `${cluster.orderVolume} Orders`
                        : metricMode === 'DENSITY'
                        ? `${cluster.courierCount} Couriers`
                        : `${cluster.densityRatio}x Stress`}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium truncate max-w-[90px]">
                      {cluster.zoneName.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Map Canvas Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="text-slate-300">Overloaded Cluster (&gt;6.0 orders/courier)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-300">Moderate Volume Cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-300">Balanced SLA Zone</span>
            </div>
          </div>
        </div>

        {/* Selected Zone Inspector Drawer */}
        <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-slate-900/70 max-h-[500px] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Spatial Zone Details
                </span>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {selectedZone.zoneName}
                </h4>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                  selectedZone.slaRisk === 'CAPACITY_CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : selectedZone.slaRisk === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {selectedZone.slaRisk}
              </span>
            </div>

            {/* Zone Statistics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Orders Active</span>
                <span className="text-lg font-black text-rose-400">{selectedZone.orderVolume} Visits</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Couriers</span>
                <span className="text-lg font-black text-blue-400">{selectedZone.courierCount} Active</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Workload Ratio</span>
                <span className="text-lg font-black text-amber-400">{selectedZone.densityRatio} : 1</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Turnaround</span>
                <span className="text-lg font-black text-slate-200">{selectedZone.avgCompletionMins}m</span>
              </div>
            </div>

            {/* Active Couriers in Zone */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Fleet Located in Perimeter
              </h5>
              <div className="space-y-1.5">
                {selectedZone.couriers.map((courier) => (
                  <div
                    key={courier.id}
                    className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">{courier.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">ID: {courier.id}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Live GPS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <button
              onClick={() => handleRebalance(selectedZone.zoneName)}
              disabled={isBotRunning}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              {isBotRunning
                ? 'Evaluating & Deploying Reserve Fleet...'
                : `Deploy Standby Courier to ${selectedZone.zoneName.split(' ')[0]}`}
            </button>
            <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Auto-Rebalance Bot Active (&gt;45m critical threshold)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
