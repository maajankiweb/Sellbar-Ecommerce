import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourierDailyMetrics extends Document {
  date: string; // YYYY-MM-DD
  courierId: string;
  courierName: string;
  totalAssigned: number;
  totalDelivered: number;
  totalFailedOrCancelled: number;
  onTimeDeliveries: number;
  onTimeRatePercent: number;
  averageRating: number;
  ratingCount: number;
  ratingsDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  topCompliments: Array<{ tag: string; count: number }>;
  avgTransitMinutes: number;
  totalDistanceKm: number;
  totalPayoutInr: number;
  aggregatedAt: Date;
}

const CourierDailyMetricsSchema = new Schema<ICourierDailyMetrics>(
  {
    date: { type: String, required: true, index: true },
    courierId: { type: String, required: true, index: true },
    courierName: { type: String, required: true },
    totalAssigned: { type: Number, default: 0 },
    totalDelivered: { type: Number, default: 0 },
    totalFailedOrCancelled: { type: Number, default: 0 },
    onTimeDeliveries: { type: Number, default: 0 },
    onTimeRatePercent: { type: Number, default: 100 },
    averageRating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    ratingsDistribution: {
      oneStar: { type: Number, default: 0 },
      twoStar: { type: Number, default: 0 },
      threeStar: { type: Number, default: 0 },
      fourStar: { type: Number, default: 0 },
      fiveStar: { type: Number, default: 0 },
    },
    topCompliments: [
      {
        tag: { type: String },
        count: { type: Number, default: 0 },
      },
    ],
    avgTransitMinutes: { type: Number, default: 25 },
    totalDistanceKm: { type: Number, default: 0 },
    totalPayoutInr: { type: Number, default: 0 },
    aggregatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound unique index ensuring one record per courier per date
CourierDailyMetricsSchema.index({ date: 1, courierId: 1 }, { unique: true });
CourierDailyMetricsSchema.index({ date: -1, averageRating: -1 });

export const CourierDailyMetrics: Model<ICourierDailyMetrics> =
  mongoose.models.CourierDailyMetrics ||
  mongoose.model<ICourierDailyMetrics>('CourierDailyMetrics', CourierDailyMetricsSchema);

export default CourierDailyMetrics;
