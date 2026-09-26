'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface DeliveryLocation {
  orderId: string;
  deliveryId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp?: number;
}

export function useDeliveryTracking(orderId: string, authToken?: string) {
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId || !authToken) return;

    const socket = io({
      path: '/api/socket.io',
      auth: { token: authToken },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);

      // Join the specific order tracking room
      socket.emit('join:order', orderId, (response: any) => {
        if (response?.success && response.lastKnownLocation) {
          setLocation(response.lastKnownLocation);
        }
      });
    });

    socket.on('delivery:location:stream', (newLocation: DeliveryLocation) => {
      if (newLocation.orderId === orderId) {
        setLocation(newLocation);
      }
    });

    socket.on('connect_error', (err) => {
      setIsConnected(false);
      setConnectionError(err.message || 'Failed to connect to tracking server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave:order', orderId);
        socketRef.current.disconnect();
      }
    };
  }, [orderId, authToken]);

  return { location, isConnected, connectionError };
}
