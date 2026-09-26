export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DeliveryStop {
  orderId: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  coordinates: GeoPoint;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  codAmount?: number;
  timeWindow?: {
    start: string;
    end: string;
  };
}

export interface RouteLeg {
  fromStop: string;
  toStop: string;
  distanceKm: number;
  durationMinutes: number;
}

export interface OptimizedRouteResult {
  origin: GeoPoint;
  originName: string;
  stops: (DeliveryStop & { sequenceNumber: number })[];
  legs: RouteLeg[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  estimatedCompletionTime: string;
  savingsVsNaiveKm: number;
}

export interface IMapsProvider {
  calculateDistanceMatrix(origins: GeoPoint[], destinations: GeoPoint[]): Promise<number[][]>;
  optimizeRoute(origin: GeoPoint, stops: DeliveryStop[]): Promise<OptimizedRouteResult>;
}
