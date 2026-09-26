export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    url?: string;
    cleartext?: boolean;
    androidScheme?: string;
    iosScheme?: string;
  };
  plugins?: Record<string, any>;
  android?: Record<string, any>;
  ios?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: 'in.selbar.driver',
  appName: 'SELBAR Driver',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // In production, loads from local asset directory or secure origin
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    BackgroundGeolocation: {
      notificationTitle: 'SELBAR Driver Tracking Active',
      notificationText: 'Sharing background GPS coordinates for scheduled pickups and deliveries',
      notificationIcon: 'ic_launcher_round',
      notificationChannel: 'selbar_driver_background_tracking',
      enableHighAccuracy: true,
      distanceFilter: 10, // Minimum distance in meters before an update event is generated
      interval: 5000, // Desired interval in milliseconds
      fastestInterval: 3000,
      activitiesInterval: 10000,
      stopOnTerminate: false,
      startOnBoot: true,
      heartbeatInterval: 30, // seconds
      maxLocations: 1000,
      locationUpdateInterval: 5000,
      stationaryRadius: 25, // meters
    },
    App: {
      urlScheme: 'selbar',
      deepLinks: [
        {
          scheme: 'https',
          host: 'selbar.in',
          pathPrefix: '/delivery',
        },
        {
          scheme: 'selbar',
          host: 'delivery',
        },
      ],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#2563EB',
      sound: 'beep.wav',
    },
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#020617',
      showSpinner: true,
      spinnerColor: '#3B82F6',
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV !== 'production',
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
  },
};

export default config;
