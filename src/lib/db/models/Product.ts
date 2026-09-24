import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductGrade {
  grade: 'brand-new' | 'superb' | 'good' | 'fair';
  title: string;
  description: string;
  price: number;
  originalMrp: number;
  stock: number;
}

export interface IProductSpecs {
  ram?: string;
  storage?: string;
  color?: string;
  screen?: string;
  processor?: string;
  camera?: string;
  battery?: string;
  [key: string]: string | undefined;
}

export interface IProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  metaRobots?: string;
}

export interface IProduct extends Document {
  id: string;
  modelId?: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  conditionType: 'new' | 'old' | 'refurbished';
  categoryGroup?: string;
  images: string[];
  description?: string;
  offerText?: string;
  price: number;
  originalMrp: number;
  discountPercent?: number;
  warrantyMonths: number;
  replacementDays?: number;
  qcPointsCount?: number;
  stock: number;
  specs: IProductSpecs;
  highlights: string[];
  grades: IProductGrade[];
  seo?: IProductSEO;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSEOSchema = new Schema<IProductSEO>(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    metaRobots: { type: String, default: 'index, follow' },
  },
  { _id: false }
);

const ProductGradeSchema = new Schema<IProductGrade>(
  {
    grade: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalMrp: { type: Number, required: true },
    stock: { type: Number, default: 1 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    modelId: { type: String },
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    conditionType: {
      type: String,
      enum: ['new', 'old', 'refurbished'],
      default: 'refurbished',
      index: true,
    },
    categoryGroup: { type: String, index: true },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    offerText: { type: String, default: '' },
    price: { type: Number, required: true },
    originalMrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    warrantyMonths: { type: Number, default: 12 },
    replacementDays: { type: Number, default: 5 },
    qcPointsCount: { type: Number, default: 32 },
    stock: { type: Number, default: 5 },
    specs: { type: Map, of: String, default: {} },
    highlights: { type: [String], default: [] },
    grades: [ProductGradeSchema],
    seo: { type: ProductSEOSchema, default: () => ({}) },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 12 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
