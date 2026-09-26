import webpush from 'web-push';
import { cacheStore } from '@/lib/auth/security/redisClient';

// VAPID keys configuration with fallback dev keys
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || 'UUxI4O8vXjY7P9x6Dq1rI7f9m8h6K5n2B0v4T8w2X1Q';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@selbar.in';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class WebPushService {
  /**
   * Save user's browser push subscription in Redis
   */
  public static async saveSubscription(userId: string, subscription: PushSubscriptionData): Promise<void> {
    const key = `push:subscription:${userId}`;
    await cacheStore.set(key, JSON.stringify(subscription), 365 * 24 * 60 * 60); // 1-year TTL
  }

  /**
   * Calculate Haversine distance in meters between two GPS coordinates
   */
  public static calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Check proximity and dispatch native 500-meter arrival push notification
   */
  public static async checkAndTriggerProximityAlert(params: {
    orderId: string;
    userId: string;
    deliveryLat: number;
    deliveryLng: number;
    destinationLat: number;
    destinationLng: number;
    customerName?: string;
  }): Promise<{ triggered: boolean; distanceMeters: number }> {
    const distanceMeters = this.calculateDistanceMeters(
      params.deliveryLat,
      params.deliveryLng,
      params.destinationLat,
      params.destinationLng
    );

    // If within 500 meters
    if (distanceMeters <= 500) {
      const alertKey = `alert:proximity:500m:${params.orderId}`;
      const alreadySent = await cacheStore.get(alertKey);

      if (!alreadySent) {
        // Mark alert as sent (4-hour TTL)
        await cacheStore.set(alertKey, 'true', 14400);

        // Fetch subscription
        const subRaw = await cacheStore.get(`push:subscription:${params.userId}`);
        if (subRaw) {
          try {
            const subscription: PushSubscriptionData = JSON.parse(subRaw);
            const payload = JSON.stringify({
              title: '🚀 Delivery Partner Arriving!',
              body: `Your delivery executive is within ${Math.round(distanceMeters)}m of your doorstep. Please keep your delivery OTP ready.`,
              icon: '/icon.svg',
              badge: '/favicon.ico',
              data: {
                url: `/order/buy/${params.orderId}`,
                orderId: params.orderId,
                timestamp: Date.now(),
              },
            });

            await webpush.sendNotification(subscription as any, payload);
            return { triggered: true, distanceMeters };
          } catch (err: any) {
            console.warn('[WebPushService] Failed to send push notification:', err?.message);
          }
        }
        return { triggered: true, distanceMeters };
      }
    }

    return { triggered: false, distanceMeters };
  }
}
