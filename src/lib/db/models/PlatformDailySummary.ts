import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlatformDailySummary extends Document {
  date: string; // YYYY-MM-DD
  totalOrdersDelivered: number;
  totalActiveCouriers: number;
  platformAverageRating: number;
  platformOnTimeRatePercent: number;
  totalCustomerFeedbackCount: number;
  ratingsDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  topRatedCouriers: Array<{
    courierId: string;
    courierName: string;
    rating: number;
    deliveredCount: number;
  }>;
  aggregatedAt: Date;
}

const PlatformDailySummarySchema = new Schema<IPlatformDailySummary>(
  {
    date: { type: String, required: true, unique: true, index: true },
    totalOrdersDelivered: { type: Number, default: 0 },
    totalActiveCouriers: { type: Number, default: 0 },
    platformAverageRating: { type: Number, default: 5.0 },
    platformOnTimeRatePercent: { type: Number, default: 100 },
    totalCustomerFeedbackCount: { type: Number, default: 0 },
    ratingsDistribution: {
      oneStar: { type: Number, default: 0 },
      twoStar: { type: Number, default: 0 },
      threeStar: { type: Number, default: 0 },
      fourStar: { type: Number, default: 0 },
      fiveStar: { type: Number, default: 0 },
    },
    topRatedCouriers: [
      {
        courierId: String,
        courierName: String,
        rating: Number,
        deliveredCount: Number,
      },
    ],
    aggregatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PlatformDailySummary: Model<IPlatformDailySummary> =
  mongoose.models.PlatformDailySummary ||
  mongoose.model<IPlatformDailySummary>('PlatformDailySummary', PlatformDailySummarySchema);

export default PlatformDailySummary;
