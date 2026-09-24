import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  order?: mongoose.Types.ObjectId;
  orderNumber: string;
  paymentType: 'COLLECTION' | 'PAYOUT';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  razorpayPayoutId?: string;
  amount: number; // In INR Rupees
  currency: string;
  method: string;
  status: 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | 'PROCESSED';
  refunds: Array<{
    refundId: string;
    amount: number;
    status: string;
    reason?: string;
    createdAt: Date;
  }>;
  webhookPayloads: unknown[];
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: false, index: true },
    orderNumber: { type: String, required: true, index: true },
    paymentType: {
      type: String,
      enum: ['COLLECTION', 'PAYOUT'],
      required: true,
    },
    razorpayOrderId: { type: String, unique: true, sparse: true, index: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true, index: true },
    razorpaySignature: { type: String },
    razorpayPayoutId: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, default: 'UPI' },
    status: {
      type: String,
      enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PROCESSED'],
      default: 'CREATED',
      index: true,
    },
    refunds: [
      {
        refundId: String,
        amount: Number,
        status: String,
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    webhookPayloads: [Schema.Types.Mixed],
    failureReason: String,
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
