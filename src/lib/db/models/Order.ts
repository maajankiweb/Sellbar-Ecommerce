import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  inventoryId?: mongoose.Types.ObjectId;
  modelName: string;
  variant: string;
  grade?: 'FAIR' | 'GOOD' | 'SUPERB';
  price: number;
  warrantyMonths?: number;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  notes?: string;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  orderNumber: string;
  orderType: 'SELL' | 'BUY';
  user?: mongoose.Types.ObjectId;
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };
  sellDetails?: {
    modelId?: mongoose.Types.ObjectId;
    modelName: string;
    variant: { ram: string; storage: string };
    quotedPrice: number;
    inspectedPrice?: number;
    conditionSummary?: Array<{ question: string; answer: string; deduction: number }>;
    pickupSlot?: {
      date: Date;
      timeWindow: string;
    };
    pickupAddress?: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
    };
    assignedExecutive?: mongoose.Types.ObjectId;
  };
  buyDetails?: {
    items: IOrderItem[];
    shippingAddress: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
    };
    trackingNumber?: string;
    courierPartner?: string;
    couponCode?: string;
    protectionPlan?: boolean;
    deliveredAt?: Date;
    returnRequest?: {
      id: string;
      type: 'REPLACEMENT' | 'REFUND';
      reason: string;
      notes?: string;
      pickupSlot: {
        date: Date;
        window: string;
      };
      pickupAddress: {
        line1: string;
        city: string;
        state: string;
        pincode: string;
      };
      status: 'REQUESTED' | 'PICKUP_SCHEDULED' | 'PICKED_UP' | 'INSPECTED' | 'COMPLETED' | 'REJECTED';
      assignedExecutive?: mongoose.Types.ObjectId;
      adminNotes?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
  payment?: mongoose.Types.ObjectId;
  statusTimeline: IOrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    orderType: { type: String, enum: ['SELL', 'BUY'], required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customer: {
      name: { type: String },
      phone: { type: String, required: true },
      email: { type: String },
    },
    sellDetails: {
      modelId: { type: Schema.Types.ObjectId, ref: 'CatalogModel' },
      modelName: String,
      variant: { ram: String, storage: String },
      quotedPrice: Number,
      inspectedPrice: Number,
      conditionSummary: [
        {
          question: String,
          answer: String,
          deduction: Number,
        },
      ],
      pickupSlot: {
        date: Date,
        timeWindow: String,
      },
      pickupAddress: {
        line1: String,
        city: String,
        state: String,
        pincode: String,
      },
      assignedExecutive: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    buyDetails: {
      items: [
        {
          inventoryId: { type: Schema.Types.ObjectId },
          modelName: String,
          variant: String,
          grade: { type: String, enum: ['FAIR', 'GOOD', 'SUPERB'] },
          price: Number,
          warrantyMonths: Number,
        },
      ],
      shippingAddress: {
        line1: String,
        city: String,
        state: String,
        pincode: String,
      },
      trackingNumber: String,
      courierPartner: String,
      couponCode: String,
      protectionPlan: Boolean,
      deliveredAt: Date,
      returnRequest: {
        id: String,
        type: { type: String, enum: ['REPLACEMENT', 'REFUND'] },
        reason: String,
        notes: String,
        pickupSlot: {
          date: Date,
          window: String,
        },
        pickupAddress: {
          line1: String,
          city: String,
          state: String,
          pincode: String,
        },
        status: {
          type: String,
          enum: ['REQUESTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'INSPECTED', 'COMPLETED', 'REJECTED'],
          default: 'REQUESTED',
        },
        assignedExecutive: { type: Schema.Types.ObjectId, ref: 'User' },
        adminNotes: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    },
    paymentMethod: { type: String, default: 'UPI' },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'QUOTED',
        'PICKUP_SCHEDULED',
        'EXECUTIVE_ASSIGNED',
        'OUT_FOR_PICKUP',
        'INSPECTED',
        'PAYMENT_PENDING',
        'PLACED',
        'PACKED',
        'SHIPPED',
        'DELIVERED',
        'RETURN_REQUESTED',
        'REFUNDED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'PLACED',
      index: true,
    },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    statusTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        notes: String,
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ 'customer.phone': 1, createdAt: -1 });
OrderSchema.index({ status: 1, orderType: 1 });

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
