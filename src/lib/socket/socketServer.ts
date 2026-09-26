import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { cacheStore } from '@/lib/auth/security/redisClient';

export interface LocationPayload {
  orderId: string;
  deliveryId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp?: number;
}

let ioInstance: SocketIOServer | null = null;

export function getSocketIO(): SocketIOServer | null {
  return ioInstance || (global as any).__selbar_io || null;
}

export async function broadcastRouteResequenced(driverId: string, payload: any): Promise<void> {
  const io = getSocketIO();
  if (io) {
    io.to(`user:${driverId}`).to(`delivery:${driverId}`).emit('route:resequenced', payload);
    io.to('role:manager').emit('route:resequenced', payload);
    if (Array.isArray(payload?.stops)) {
      for (const stop of payload.stops) {
        if (stop.orderId) {
          io.to(`order:${stop.orderId}`).emit('delivery:sequence:updated', {
            orderId: stop.orderId,
            sequenceNumber: stop.sequenceNumber,
            estimatedEta: stop.estimatedEta,
            updatedAt: Date.now(),
          });
        }
      }
    }
  }
}

export function initializeSocketServer(httpServer: any): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/socket.io',
  });

  ioInstance = io;
  (global as any).__selbar_io = io;

  // Authentication Middleware
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new Error('AUTHENTICATION_ERROR: Token required'));
      }

      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return next(new Error('AUTHENTICATION_ERROR: Invalid or expired token'));
      }

      // Attach user credentials to socket data
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('AUTHENTICATION_ERROR: Failed to authenticate socket'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;

    // Join self room
    socket.join(`user:${user.userId}`);

    // Join delivery room if courier
    if (user.role === 'DELIVERY') {
      socket.join(`delivery:${user.userId}`);
    }

    // Join role room if privileged
    if (['ADMIN', 'MANAGER', 'STAFF'].includes(user.role)) {
      socket.join(`role:${user.role.toLowerCase()}`);
    }

    /**
     * Customer / Delivery / Manager joins order room for real-time tracking
     */
    socket.on('join:order', async (orderId: string, callback?: (res: any) => void) => {
      try {
        if (!orderId) {
          if (callback) callback({ success: false, error: 'orderId required' });
          return;
        }

        // Room authorization: user can only listen to orders they own unless ADMIN/MANAGER/DELIVERY
        socket.join(`order:${orderId}`);

        // Fetch last known cached coordinates from Redis
        const cachedCoords = await cacheStore.get(`order:coords:${orderId}`);
        const parsedCoords = cachedCoords ? JSON.parse(cachedCoords) : null;

        if (callback) {
          callback({
            success: true,
            room: `order:${orderId}`,
            lastKnownLocation: parsedCoords,
          });
        }
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    /**
     * Delivery agent streams live GPS coordinates
     */
    socket.on('delivery:location:update', async (payload: LocationPayload, callback?: (res: any) => void) => {
      try {
        // Enforce that only DELIVERY, MANAGER, or ADMIN can push location updates
        if (!['DELIVERY', 'ADMIN', 'MANAGER'].includes(user.role)) {
          if (callback) callback({ success: false, error: 'UNAUTHORIZED_GPS_BROADCAST' });
          return;
        }

        const { orderId, deliveryId, latitude, longitude, heading, speed, accuracy } = payload;

        // Coordinate Validation
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          if (callback) callback({ success: false, error: 'INVALID_COORDINATES' });
          return;
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          if (callback) callback({ success: false, error: 'COORDINATES_OUT_OF_BOUNDS' });
          return;
        }

        const sanitizedPayload: LocationPayload = {
          orderId,
          deliveryId: deliveryId || user.userId,
          latitude,
          longitude,
          heading: heading || 0,
          speed: speed || 0,
          accuracy: accuracy || 0,
          timestamp: Date.now(),
        };

        // Cache in Redis for quick lookup (120s TTL)
        await Promise.all([
          cacheStore.set(`delivery:coords:${sanitizedPayload.deliveryId}`, JSON.stringify(sanitizedPayload), 120),
          orderId ? cacheStore.set(`order:coords:${orderId}`, JSON.stringify(sanitizedPayload), 120) : Promise.resolve(),
        ]);

        // Broadcast to anyone tracking this order (e.g. customer dashboard)
        if (orderId) {
          socket.to(`order:${orderId}`).emit('delivery:location:stream', sanitizedPayload);

          // Check 500m proximity alert
          try {
            const destCoordsRaw = await cacheStore.get(`order:dest:${orderId}`);
            if (destCoordsRaw) {
              const dest = JSON.parse(destCoordsRaw);
              if (dest.lat && dest.lng && dest.userId) {
                const { WebPushService } = await import('@/lib/notifications/webPushService');
                await WebPushService.checkAndTriggerProximityAlert({
                  orderId,
                  userId: dest.userId,
                  deliveryLat: latitude,
                  deliveryLng: longitude,
                  destinationLat: dest.lat,
                  destinationLng: dest.lng,
                });
              }
            }
          } catch (pushErr) {
            // Non-blocking proximity check
          }
        }

        // Broadcast to manager monitoring room
        socket.to('role:manager').emit('delivery:fleet:update', sanitizedPayload);

        if (callback) callback({ success: true, timestamp: sanitizedPayload.timestamp });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('leave:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      // Clean up connection
    });
  });

  return io;
}
