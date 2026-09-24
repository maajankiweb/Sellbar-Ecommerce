import { connectToDatabase } from '@/lib/db/mongodb';
import { Product, IProduct } from '@/lib/db/models/Product';
import { REFURB_PRODUCTS } from '@/lib/db/data';
import { RefurbProduct } from '@/types';

// Convert RefurbProduct to full Product structure
function normalizeInitialProduct(p: RefurbProduct): any {
  const topGrade = p.grades[0] || {
    grade: 'superb',
    title: 'Superb (Like New)',
    description: '',
    price: 39999,
    originalMrp: 69900,
    stock: 5,
  };
  const originalMrp = topGrade.originalMrp || 50000;
  const price = topGrade.price || 30000;
  const discountPercent = originalMrp > price ? Math.round(((originalMrp - price) / originalMrp) * 100) : 0;

  return {
    id: p.id,
    modelId: p.modelId,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    conditionType: p.conditionType || (p.grades.some((g) => g.grade === 'brand-new') ? 'new' : 'refurbished'),
    categoryGroup: p.categoryGroup || (p.category.includes('new') ? p.category : p.category.includes('old') ? p.category : p.category === 'phone' ? 'old-phone' : p.category === 'laptop' ? 'old-laptop' : p.category === 'desktop' ? 'old-desktop' : p.category),
    images: p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
    description: `${p.name} with verified hardware, ${p.warrantyMonths || 12} months warranty, and ${p.qcPointsCount || 32}-point quality inspection.`,
    offerText: discountPercent > 40 ? `Super Deal • Flat ${discountPercent}% Off` : 'Special Promo Offer',
    price,
    originalMrp,
    discountPercent,
    warrantyMonths: p.warrantyMonths || 12,
    replacementDays: p.replacementDays || 5,
    qcPointsCount: p.qcPointsCount || 32,
    stock: topGrade.stock || 5,
    specs: p.specs || {},
    highlights: p.highlights || ['100% Quality Inspected', '12-Month Assured Warranty', 'Doorstep Delivery'],
    grades: p.grades || [topGrade],
    rating: p.rating || 4.8,
    reviewCount: p.reviewCount || 25,
    featured: !!p.featured,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Global in-memory cache to ensure state persists across HMR/hot-reloads in Node runtime
declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_PRODUCTS_STORE__: any[] | undefined;
}

let memoryProducts: any[] = global.__SELBAR_PRODUCTS_STORE__ || [];

if (!global.__SELBAR_PRODUCTS_STORE__ || global.__SELBAR_PRODUCTS_STORE__.length === 0) {
  memoryProducts = REFURB_PRODUCTS.map(normalizeInitialProduct);
  global.__SELBAR_PRODUCTS_STORE__ = memoryProducts;
}

export async function getAllProducts(filters?: {
  category?: string;
  brand?: string;
  condition?: string;
  search?: string;
  featured?: boolean;
}): Promise<any[]> {
  try {
    const db = await connectToDatabase();
    if (db && Product) {
      const query: any = { isActive: true };
      if (filters?.category && filters.category !== 'all') {
        query.$or = [
          { category: filters.category },
          { categoryGroup: filters.category },
        ];
      }
      if (filters?.brand && filters.brand !== 'all') {
        query.brand = new RegExp(`^${filters.brand}$`, 'i');
      }
      if (filters?.condition && filters.condition !== 'all') {
        query.conditionType = filters.condition;
      }
      if (filters?.search) {
        query.$or = [
          { name: new RegExp(filters.search, 'i') },
          { brand: new RegExp(filters.search, 'i') },
          { description: new RegExp(filters.search, 'i') },
        ];
      }
      if (typeof filters?.featured === 'boolean') {
        query.featured = filters.featured;
      }

      const count = await Product.countDocuments();
      if (count === 0 && memoryProducts.length > 0) {
        // Seed MongoDB if empty
        await Product.insertMany(memoryProducts);
      }

      const mongoProducts = await Product.find(query).sort({ createdAt: -1 }).lean();
      if (mongoProducts && mongoProducts.length > 0) {
        return mongoProducts.map((doc: any) => ({
          ...doc,
          _id: doc._id?.toString(),
          id: doc.id || doc._id?.toString(),
        }));
      }
    }
  } catch (err) {
    console.warn('MongoDB query failed, falling back to memory store:', err);
  }

  // Memory Fallback Filter
  let list = [...memoryProducts];
  if (filters?.category && filters.category !== 'all') {
    list = list.filter(
      (p) =>
        p.category === filters.category ||
        p.categoryGroup === filters.category ||
        (filters.category === 'old-phone' && (!p.categoryGroup && p.category === 'phone'))
    );
  }
  if (filters?.brand && filters.brand !== 'all') {
    list = list.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
  }
  if (filters?.condition && filters.condition !== 'all') {
    list = list.filter((p) => p.conditionType === filters.condition);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }
  if (typeof filters?.featured === 'boolean') {
    list = list.filter((p) => p.featured === filters.featured);
  }

  return list;
}

export async function getProductById(idOrSlug: string): Promise<any | null> {
  try {
    const db = await connectToDatabase();
    if (db && Product) {
      const doc = await Product.findOne({
        $or: [{ id: idOrSlug }, { slug: idOrSlug }, { _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : undefined }],
        isActive: true,
      }).lean();
      if (doc) {
        return {
          ...doc,
          _id: (doc as any)._id?.toString(),
          id: (doc as any).id || (doc as any)._id?.toString(),
        };
      }
    }
  } catch {
    // fallback
  }

  return memoryProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function createProduct(productData: any): Promise<any> {
  let cleanSlug = productData.slug
    ? productData.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '')
    : productData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (!cleanSlug) {
    cleanSlug = `product-${Date.now()}`;
  }

  const id = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const originalMrp = Number(productData.originalMrp) || Number(productData.price) || 0;
  const price = Number(productData.price) || 0;
  const discountPercent =
    originalMrp > price ? Math.round(((originalMrp - price) / originalMrp) * 100) : 0;

  const images = Array.isArray(productData.images) && productData.images.length > 0
    ? productData.images
    : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'];

  const seo = {
    title: productData.seo?.title || productData.seoTitle || productData.name,
    description: productData.seo?.description || productData.seoDescription || productData.description || '',
    keywords: Array.isArray(productData.seo?.keywords)
      ? productData.seo.keywords
      : typeof productData.seoKeywords === 'string'
      ? productData.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : [],
    canonicalUrl: productData.seo?.canonicalUrl || productData.canonicalUrl || `/buy/${cleanSlug}`,
    ogImage: productData.seo?.ogImage || productData.ogImage || images[0] || '',
    metaRobots: productData.seo?.metaRobots || 'index, follow',
  };

  const newProduct: any = {
    ...productData,
    id,
    slug: cleanSlug,
    price,
    originalMrp,
    discountPercent,
    stock: Number(productData.stock) || 5,
    warrantyMonths: Number(productData.warrantyMonths) || 12,
    rating: Number(productData.rating) || 4.9,
    reviewCount: Number(productData.reviewCount) || 1,
    featured: Boolean(productData.featured),
    isActive: true,
    images,
    seo,
    grades: [
      {
        grade: productData.conditionType === 'new' ? 'brand-new' : 'superb',
        title: productData.conditionType === 'new' ? 'Brand New (Sealed Pack)' : 'Superb (Like New)',
        description: productData.description || 'Verified Quality',
        price,
        originalMrp,
        stock: Number(productData.stock) || 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 1. Try MongoDB
  try {
    const db = await connectToDatabase();
    if (db && Product) {
      const created = await Product.create(newProduct);
      const json: any = created.toObject();
      json._id = json._id?.toString();
      // Also update memory
      memoryProducts.unshift(json);
      return json;
    }
  } catch (err) {
    console.warn('MongoDB create failed, saving to memory store:', err);
  }

  // 2. Memory Store
  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: any): Promise<any | null> {
  const originalMrp = updates.originalMrp !== undefined ? Number(updates.originalMrp) : undefined;
  const price = updates.price !== undefined ? Number(updates.price) : undefined;
  
  const payload: any = {
    ...updates,
    updatedAt: new Date(),
  };

  if (updates.slug) {
    payload.slug = updates.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  if (price !== undefined && originalMrp !== undefined && originalMrp > 0) {
    payload.discountPercent = Math.round(((originalMrp - price) / originalMrp) * 100);
  }

  if (updates.seo || updates.seoTitle || updates.seoDescription || updates.seoKeywords) {
    payload.seo = {
      title: updates.seo?.title || updates.seoTitle || updates.name || '',
      description: updates.seo?.description || updates.seoDescription || updates.description || '',
      keywords: Array.isArray(updates.seo?.keywords)
        ? updates.seo.keywords
        : typeof updates.seoKeywords === 'string'
        ? updates.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
        : updates.seo?.keywords || [],
      canonicalUrl: updates.seo?.canonicalUrl || updates.canonicalUrl || `/buy/${payload.slug || id}`,
      ogImage: updates.seo?.ogImage || updates.ogImage || (updates.images && updates.images[0]) || '',
      metaRobots: updates.seo?.metaRobots || 'index, follow',
    };
  }

  // 1. Try MongoDB
  try {
    const db = await connectToDatabase();
    if (db && Product) {
      const updated = await Product.findOneAndUpdate(
        { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }] },
        { $set: payload },
        { new: true }
      ).lean();
      if (updated) {
        const json: any = {
          ...updated,
          _id: (updated as any)._id?.toString(),
        };
        // Update memory store as well
        const idx = memoryProducts.findIndex((p) => p.id === id || p._id === id);
        if (idx !== -1) {
          memoryProducts[idx] = { ...memoryProducts[idx], ...json };
        }
        return json;
      }
    }
  } catch (err) {
    console.warn('MongoDB update failed, saving to memory store:', err);
  }

  // 2. Memory Store
  const idx = memoryProducts.findIndex((p) => p.id === id || p.slug === id);
  if (idx !== -1) {
    memoryProducts[idx] = {
      ...memoryProducts[idx],
      ...payload,
      price: price ?? memoryProducts[idx].price,
      originalMrp: originalMrp ?? memoryProducts[idx].originalMrp,
      discountPercent:
        (originalMrp ?? memoryProducts[idx].originalMrp) > (price ?? memoryProducts[idx].price)
          ? Math.round(
              (((originalMrp ?? memoryProducts[idx].originalMrp) - (price ?? memoryProducts[idx].price)) /
                (originalMrp ?? memoryProducts[idx].originalMrp)) *
                100
            )
          : 0,
      updatedAt: new Date(),
    };
    return memoryProducts[idx];
  }

  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Try MongoDB
  try {
    const db = await connectToDatabase();
    if (db && Product) {
      await Product.deleteOne({
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
      });
    }
  } catch (err) {
    console.warn('MongoDB delete failed:', err);
  }

  // 2. Memory Store
  const prevLen = memoryProducts.length;
  memoryProducts = memoryProducts.filter((p) => p.id !== id && p.slug !== id && p._id !== id);
  if (global.__SELBAR_PRODUCTS_STORE__) {
    global.__SELBAR_PRODUCTS_STORE__ = memoryProducts;
  }
  return memoryProducts.length < prevLen;
}

// In-memory custom categories store
declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_CUSTOM_CATEGORIES__: string[] | undefined;
}

const DEFAULT_CATEGORIES = [
  'new-phone',
  'refurb-phone',
  'old-phone',
  'laptop',
  'old-laptop',
  'tablet',
  'old-tablet',
  'watch',
  'old-watch',
  'audio',
  'gaming',
  'desktop',
  'old-desktop',
  'accessories',
];

if (!global.__SELBAR_CUSTOM_CATEGORIES__) {
  global.__SELBAR_CUSTOM_CATEGORIES__ = [];
}

export async function getDistinctCategories(): Promise<string[]> {
  const categoriesSet = new Set<string>(DEFAULT_CATEGORIES);

  // Add from memory products
  memoryProducts.forEach((p) => {
    if (p.category) categoriesSet.add(p.category);
    if (p.categoryGroup) categoriesSet.add(p.categoryGroup);
  });

  // Add custom registered categories
  if (global.__SELBAR_CUSTOM_CATEGORIES__) {
    global.__SELBAR_CUSTOM_CATEGORIES__.forEach((c) => categoriesSet.add(c));
  }

  // Add from MongoDB
  try {
    const db = await connectToDatabase();
    if (db && Product) {
      const dbCategories = await Product.distinct('category');
      dbCategories.forEach((c) => {
        if (c) categoriesSet.add(c);
      });
    }
  } catch {
    // Ignore DB errors
  }

  return Array.from(categoriesSet).filter(Boolean);
}

export async function addCustomCategory(categoryName: string): Promise<string> {
  const clean = categoryName.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
  if (!clean) return '';
  if (!global.__SELBAR_CUSTOM_CATEGORIES__) {
    global.__SELBAR_CUSTOM_CATEGORIES__ = [];
  }
  if (!global.__SELBAR_CUSTOM_CATEGORIES__.includes(clean)) {
    global.__SELBAR_CUSTOM_CATEGORIES__.push(clean);
  }
  return clean;
}

