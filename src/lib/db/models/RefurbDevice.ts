import mongoose, { Schema, Document, Model } from 'mongoose';

export type WarehouseZone =
  | 'RECEIVING'
  | 'DATA_WIPE'
  | 'REPAIR'
  | 'QC'
  | 'READY_FOR_RESALE'
  | 'PACKING'
  | 'DISPATCH'
  | 'RECYCLING';

export type DeviceLifecycleStatus =
  | 'PURCHASED'
  | 'RECEIVED'
  | 'DATA_WIPED'
  | 'REPAIR_IN_PROGRESS'
  | 'QC_PASSED'
  | 'GRADED'
  | 'LISTED'
  | 'RESERVED'
  | 'SOLD'
  | 'RECYCLED';

export type DeviceGrade = 'A+' | 'A' | 'B' | 'C' | 'D';

export interface IRefurbDevice extends Document {
  deviceId: string; // e.g. DEV-2026-000101
  imei: string;
  serialNumber?: string;
  modelName: string;
  brand: string;
  category: string;
  storage: string;
  ram?: string;
  color?: string;
  batteryHealth: number; // e.g. 91%
  grade?: DeviceGrade;
  
  // Financial & Profitability Ledger
  financials: {
    buybackPrice: number;
    logisticsCost: number;
    repairCost: number;
    partsCost: number;
    warehouseOverhead: number;
    totalCost: number;
    sellingPrice: number;
    grossProfit: number;
    grossMarginPercent: number;
  };

  // Warehouse physical tracking
  warehouse: string; // e.g. "Patna Central Hub", "Bettiah Hub"
  zone: WarehouseZone;
  rackBin: string; // e.g. "Rack A-03, Bin B-12"
  status: DeviceLifecycleStatus;

  // NIST 800-88 Data Sanitization
  dataWipe: {
    wiped: boolean;
    certificateId?: string;
    wipedAt?: Date;
    operatorId?: string;
    sha256Hash?: string;
    method?: string;
  };

  // 32-Point Quality Control
  qualityControl: {
    passed: boolean;
    inspectedAt?: Date;
    technicianId?: string;
    scorePercent?: number;
    displayPassed: boolean;
    touchPassed: boolean;
    camerasPassed: boolean;
    batteryPassed: boolean;
    biometricsPassed: boolean;
    wirelessPassed: boolean;
    speakersPassed: boolean;
  };

  // Parts Replaced (Spare parts ledger)
  partsReplaced: Array<{
    partName: string;
    sku: string;
    cost: number;
    installedAt: Date;
    technicianId: string;
  }>;

  sourceSellOrderId?: string;
  marketplaceProductId?: string;
  history: Array<{
    stage: string;
    timestamp: Date;
    actor: string;
    remarks: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const RefurbDeviceSchema = new Schema<IRefurbDevice>(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    imei: { type: String, required: true, index: true },
    serialNumber: { type: String },
    modelName: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, default: 'phone' },
    storage: { type: String, required: true },
    ram: { type: String },
    color: { type: String },
    batteryHealth: { type: Number, default: 90 },
    grade: { type: String, enum: ['A+', 'A', 'B', 'C', 'D'], default: 'A' },

    financials: {
      buybackPrice: { type: Number, required: true, default: 0 },
      logisticsCost: { type: Number, default: 450 },
      repairCost: { type: Number, default: 0 },
      partsCost: { type: Number, default: 0 },
      warehouseOverhead: { type: Number, default: 350 },
      totalCost: { type: Number, default: 0 },
      sellingPrice: { type: Number, default: 0 },
      grossProfit: { type: Number, default: 0 },
      grossMarginPercent: { type: Number, default: 0 },
    },

    warehouse: { type: String, default: 'Patna Central Hub', index: true },
    zone: {
      type: String,
      enum: ['RECEIVING', 'DATA_WIPE', 'REPAIR', 'QC', 'READY_FOR_RESALE', 'PACKING', 'DISPATCH', 'RECYCLING'],
      default: 'RECEIVING',
      index: true,
    },
    rackBin: { type: String, default: 'Rack A-01, Bin B-01' },
    status: {
      type: String,
      enum: ['PURCHASED', 'RECEIVED', 'DATA_WIPED', 'REPAIR_IN_PROGRESS', 'QC_PASSED', 'GRADED', 'LISTED', 'RESERVED', 'SOLD', 'RECYCLED'],
      default: 'RECEIVED',
      index: true,
    },

    dataWipe: {
      wiped: { type: Boolean, default: false },
      certificateId: { type: String },
      wipedAt: { type: Date },
      operatorId: { type: String },
      sha256Hash: { type: String },
      method: { type: String, default: 'NIST SP 800-88 Rev. 1 Purge' },
    },

    qualityControl: {
      passed: { type: Boolean, default: false },
      inspectedAt: { type: Date },
      technicianId: { type: String },
      scorePercent: { type: Number, default: 100 },
      displayPassed: { type: Boolean, default: true },
      touchPassed: { type: Boolean, default: true },
      camerasPassed: { type: Boolean, default: true },
      batteryPassed: { type: Boolean, default: true },
      biometricsPassed: { type: Boolean, default: true },
      wirelessPassed: { type: Boolean, default: true },
      speakersPassed: { type: Boolean, default: true },
    },

    partsReplaced: [
      {
        partName: { type: String },
        sku: { type: String },
        cost: { type: Number },
        installedAt: { type: Date, default: Date.now },
        technicianId: { type: String },
      },
    ],

    sourceSellOrderId: { type: String },
    marketplaceProductId: { type: String },
    history: [
      {
        stage: { type: String },
        timestamp: { type: Date, default: Date.now },
        actor: { type: String },
        remarks: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save recalculation hook for unit profitability
RefurbDeviceSchema.pre('save', function () {
  const f = this.financials;
  f.totalCost = f.buybackPrice + f.logisticsCost + f.repairCost + f.partsCost + f.warehouseOverhead;
  if (f.sellingPrice > 0) {
    f.grossProfit = f.sellingPrice - f.totalCost;
    f.grossMarginPercent = Math.round((f.grossProfit / f.sellingPrice) * 1000) / 10;
  }
});

export const RefurbDevice: Model<IRefurbDevice> =
  mongoose.models.RefurbDevice || mongoose.model<IRefurbDevice>('RefurbDevice', RefurbDeviceSchema);
