import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  ram: string;
  storage: string;
  basePrice: number;
}

export interface ICatalogModel extends Document {
  brand: string;
  modelName: string;
  category: 'smartphone' | 'laptop' | 'tablet';
  slug: string;
  imageUrl: string;
  variants: IVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
});

const CatalogModelSchema = new Schema<ICatalogModel>(
  {
    brand: { type: String, required: true, index: true },
    modelName: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['smartphone', 'laptop', 'tablet'],
      default: 'smartphone',
      index: true,
    },
    slug: { type: String, required: true, unique: true, index: true },
    imageUrl: { type: String, required: true },
    variants: [VariantSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CatalogModelSchema.index({ brand: 1, modelName: 1 });
CatalogModelSchema.index({ modelName: 'text' });

export const CatalogModel: Model<ICatalogModel> =
  mongoose.models.CatalogModel ||
  mongoose.model<ICatalogModel>('CatalogModel', CatalogModelSchema);

export default CatalogModel;
