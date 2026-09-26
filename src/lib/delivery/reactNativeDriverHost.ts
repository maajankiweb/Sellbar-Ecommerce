/**
 * React Native Driver Host Bridge (Companion Spec)
 *
 * For native React Native mobile projects wrapping the SELBAR web app inside <WebView>.
 * This file specifies the native contract, event schemas, and Android background service config.
 */

export interface RNBackgroundGeoConfig {
  driverId: string;
  orderId?: string;
  distanceFilter: number;
  notificationTitle: string;
  notificationText: string;
  channelId?: string;
}

export interface RNLocationPayload {
  type: 'NATIVE_LOCATION_UPDATE';
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
    timestamp: number;
  };
}

/**
 * Example React Native Container Code (Drop-in snippet for App.tsx in React Native):
 * 
 * ```typescript
 * import React, { useRef, useEffect } from 'react';
 * import { WebView } from 'react-native-webview';
 * import BackgroundGeolocation from 'react-native-background-geolocation';
 * 
 * export default function DriverApp() {
 *   const webViewRef = useRef<WebView>(null);
 * 
 *   const onMessage = (event: any) => {
 *     try {
 *       const data = JSON.parse(event.nativeEvent.data);
 *       if (data.action === 'START_BACKGROUND_TRACKING') {
 *         BackgroundGeolocation.ready({
 *           desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
 *           distanceFilter: data.payload.distanceFilter || 10,
 *           stopOnTerminate: false,
 *           startOnBoot: true,
 *           notification: {
 *             title: data.payload.notificationTitle,
 *             text: data.payload.notificationText,
 *             channelName: 'SELBAR Delivery Tracking',
 *           }
 *         }, (state) => {
 *           if (!state.enabled) BackgroundGeolocation.start();
 *         });
 * 
 *         BackgroundGeolocation.onLocation((location) => {
 *           const payload = {
 *             type: 'NATIVE_LOCATION_UPDATE',
 *             location: {
 *               latitude: location.coords.latitude,
 *               longitude: location.coords.longitude,
 *               accuracy: location.coords.accuracy,
 *               altitude: location.coords.altitude,
 *               heading: location.coords.heading,
 *               speed: location.coords.speed,
 *               timestamp: location.timestamp,
 *             }
 *           };
 *           webViewRef.current?.postMessage(JSON.stringify(payload));
 *         });
 *       } else if (data.action === 'STOP_BACKGROUND_TRACKING') {
 *         BackgroundGeolocation.stop();
 *       }
 *     } catch (e) {
 *       console.error('Error handling message from WebView', e);
 *     }
 *   };
 * 
 *   return (
 *     <WebView
 *       ref={webViewRef}
 *       source={{ uri: 'https://selbar.in/delivery' }}
 *       onMessage={onMessage}
 *       allowsInlineMediaPlayback
 *       mediaPlaybackRequiresUserAction={false}
 *       geolocationEnabled
 *     />
 *   );
 * }
 * ```
 */

export const REACT_NATIVE_ANDROID_PERMISSIONS = [
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_BACKGROUND_LOCATION',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_LOCATION',
  'android.permission.WAKE_LOCK',
  'android.permission.POST_NOTIFICATIONS',
];
