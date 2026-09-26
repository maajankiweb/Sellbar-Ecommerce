/**
 * SELBAR Native Driver Mobile Bridge
 * 
 * Provides unified cross-platform background geolocation management:
 * 1. Capacitor Native (Android Foreground Service / iOS Background Location)
 * 2. React Native WebView Container (postMessage bridge)
 * 3. Mobile PWA / Browser (Screen Wake Lock API + Silent Audio Heartbeat thread keep-alive)
 */

export interface DriverLocationPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export type MobilePlatform = 'capacitor' | 'react-native' | 'pwa' | 'web';

export interface BackgroundTrackingOptions {
  orderId?: string;
  driverId: string;
  distanceFilterMeters?: number;
  updateIntervalMs?: number;
  notificationTitle?: string;
  notificationText?: string;
  onLocationUpdate?: (location: DriverLocationPoint) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      Plugins?: {
        BackgroundGeolocation?: any;
        App?: any;
        LocalNotifications?: any;
      };
    };
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

class NativeDriverBridgeService {
  private isTracking = false;
  private watchId: number | string | null = null;
  private wakeLockSentinel: any = null;
  private audioKeepAliveContext: AudioContext | null = null;
  private audioKeepAliveTimer: NodeJS.Timeout | null = null;
  private activeOptions: BackgroundTrackingOptions | null = null;
  private listeners: Array<(loc: DriverLocationPoint) => void> = [];

  /**
   * Detects the runtime execution target
   */
  public getPlatform(): MobilePlatform {
    if (typeof window === 'undefined') return 'web';

    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      return 'capacitor';
    }

    if (typeof window.ReactNativeWebView !== 'undefined') {
      return 'react-native';
    }

    const isMobileBrowser = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    if (isStandalone || isMobileBrowser) {
      return 'pwa';
    }

    return 'web';
  }

  /**
   * Returns true if running inside a native mobile wrapper (Capacitor or React Native)
   */
  public isNativeContainer(): boolean {
    const platform = this.getPlatform();
    return platform === 'capacitor' || platform === 'react-native';
  }

  /**
   * Request mobile Screen Wake Lock to prevent phone screen from locking while vehicle-mounted
   */
  public async requestWakeLock(): Promise<boolean> {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
      return false;
    }

    try {
      this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      this.wakeLockSentinel.addEventListener('release', () => {
        // Automatically re-request if tracking is still active
        if (this.isTracking && document.visibilityState === 'visible') {
          this.requestWakeLock().catch(() => {});
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Releases screen wake lock
   */
  public async releaseWakeLock(): Promise<void> {
    if (this.wakeLockSentinel) {
      try {
        await this.wakeLockSentinel.release();
      } catch {
        // Ignore release failures
      }
      this.wakeLockSentinel = null;
    }
  }

  /**
   * Starts a silent zero-volume Web Audio loop that prevents mobile browsers (Safari/Chrome)
   * from suspending JavaScript workers & timer threads when the device screen is locked.
   */
  private startSilentAudioHeartbeat(): void {
    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioKeepAliveContext = new AudioCtx();
      const ctx = this.audioKeepAliveContext;

      // Play an imperceptible near-zero gain pulse every 25 seconds
      const playHeartbeatPulse = () => {
        if (!ctx || ctx.state === 'closed') return;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.00001; // Silent
        osc.frequency.value = 40;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        osc.start(now);
        osc.stop(now + 0.1);
      };

      playHeartbeatPulse();
      this.audioKeepAliveTimer = setInterval(playHeartbeatPulse, 25000);
    } catch {
      // Audio heartbeat fallback
    }
  }

  /**
   * Stops the silent audio keep-alive thread
   */
  private stopSilentAudioHeartbeat(): void {
    if (this.audioKeepAliveTimer) {
      clearInterval(this.audioKeepAliveTimer);
      this.audioKeepAliveTimer = null;
    }
    if (this.audioKeepAliveContext) {
      try {
        this.audioKeepAliveContext.close().catch(() => {});
      } catch {
        // Ignore close error
      }
      this.audioKeepAliveContext = null;
    }
  }

  /**
   * Starts background location tracking across Capacitor, React Native, or Mobile Browser
   */
  public async startBackgroundTracking(options: BackgroundTrackingOptions): Promise<boolean> {
    if (this.isTracking) {
      return true;
    }

    this.activeOptions = options;
    const platform = this.getPlatform();

    // 1. Target: Native Capacitor App
    if (platform === 'capacitor' && window.Capacitor?.Plugins?.BackgroundGeolocation) {
      try {
        const bgGeo = window.Capacitor.Plugins.BackgroundGeolocation;
        const watchResult = await bgGeo.addWatcher(
          {
            backgroundMessage: options.notificationText || 'Sharing live GPS coordinates for SELBAR dispatch',
            backgroundTitle: options.notificationTitle || 'SELBAR Driver Active',
            requestPermissions: true,
            stale: false,
            distanceFilter: options.distanceFilterMeters || 10,
          },
          (location: any, error: any) => {
            if (error) {
              if (options.onError) options.onError(error.message || 'Background location error');
              return;
            }
            if (location) {
              this.handleRawLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
                altitude: location.altitude,
                heading: location.bearing ?? location.heading,
                speed: location.speed,
                timestamp: location.time ? Number(location.time) : Date.now(),
              });
            }
          }
        );

        this.watchId = watchResult;
        this.isTracking = true;
        return true;
      } catch (err: any) {
        // Fall back to web geolocation if capacitor plugin throws
        console.warn('[Capacitor Bridge] Plugin watcher failed, falling back to Web API', err);
      }
    }

    // 2. Target: React Native Mobile Container
    if (platform === 'react-native' && window.ReactNativeWebView) {
      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            action: 'START_BACKGROUND_TRACKING',
            payload: {
              driverId: options.driverId,
              orderId: options.orderId,
              distanceFilter: options.distanceFilterMeters || 10,
              notificationTitle: options.notificationTitle || 'SELBAR Driver Active',
              notificationText: options.notificationText || 'Tracking delivery trip in background',
            },
          })
        );

        // Listen for native coordinates injected via message event
        const rnMessageListener = (event: MessageEvent) => {
          try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (data?.type === 'NATIVE_LOCATION_UPDATE' && data.location) {
              this.handleRawLocation(data.location);
            }
          } catch {
            // Ignore non-json frames
          }
        };

        window.addEventListener('message', rnMessageListener);
        (this as any)._rnListener = rnMessageListener;
        this.isTracking = true;
        return true;
      } catch (rnErr: any) {
        console.warn('[React Native Bridge] postMessage failed, falling back to Web API', rnErr);
      }
    }

    // 3. Target: Mobile PWA / Web Browser with Screen WakeLock & Heartbeat
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      await this.requestWakeLock();
      this.startSilentAudioHeartbeat();

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.handleRawLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            timestamp: pos.timestamp,
          });
        },
        (err) => {
          if (options.onError) {
            options.onError(err.message);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000,
        }
      );

      this.watchId = watchId;
      this.isTracking = true;
      return true;
    }

    if (options.onError) {
      options.onError('GEOLOCATION_UNSUPPORTED');
    }
    return false;
  }

  /**
   * Internal distributor for received location coordinates
   */
  private handleRawLocation(loc: DriverLocationPoint): void {
    if (this.activeOptions?.onLocationUpdate) {
      this.activeOptions.onLocationUpdate(loc);
    }

    this.listeners.forEach((fn) => {
      try {
        fn(loc);
      } catch {
        // Listener error safety
      }
    });
  }

  /**
   * Stops background tracking and releases system wake locks
   */
  public async stopBackgroundTracking(): Promise<void> {
    if (!this.isTracking) return;

    const platform = this.getPlatform();

    if (platform === 'capacitor' && window.Capacitor?.Plugins?.BackgroundGeolocation && this.watchId) {
      try {
        await window.Capacitor.Plugins.BackgroundGeolocation.removeWatcher({ id: this.watchId });
      } catch {
        // Ignore removal error
      }
    } else if (platform === 'react-native' && window.ReactNativeWebView) {
      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ action: 'STOP_BACKGROUND_TRACKING' })
        );
        if ((this as any)._rnListener) {
          window.removeEventListener('message', (this as any)._rnListener);
        }
      } catch {
        // Ignore RN cleanup error
      }
    } else if (typeof this.watchId === 'number' && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(this.watchId);
    }

    await this.releaseWakeLock();
    this.stopSilentAudioHeartbeat();

    this.watchId = null;
    this.isTracking = false;
    this.activeOptions = null;
  }

  /**
   * Adds an external location listener
   */
  public addLocationListener(callback: (location: DriverLocationPoint) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }

  /**
   * Returns current background status
   */
  public isBackgroundActive(): boolean {
    return this.isTracking;
  }
}

export const NativeDriverBridge = new NativeDriverBridgeService();
