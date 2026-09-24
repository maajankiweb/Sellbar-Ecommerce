'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SellOrder, BuyOrder, DeviceModel, Coupon } from '@/types';
import { MODELS } from '@/lib/db/data';
import {
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Smartphone,
  Laptop,
  Monitor,
  Edit,
  Save,
  Truck,
  Plus,
  Trash2,
  Upload,
  X,
  Search,
  Tag,
  ExternalLink,
  Sparkles,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Percent,
  BarChart3,
  Globe,
  Link2,
  Eye,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

export default function AdminOpsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'returns' | 'coupons' | 'analytics' | 'pricing'>('products');
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Categories list & custom category creation
  const [categoriesList, setCategoriesList] = useState<string[]>([
    'new-phone',
    'old-phone',
    'new-laptop',
    'old-laptop',
    'new-desktop',
    'old-desktop',
    'smartwatch',
    'tablet',
    'audio',
    'gaming',
    'accessories',
  ]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Buy Order Dispatch Modal State
  const [selectedBuyOrder, setSelectedBuyOrder] = useState<BuyOrder | null>(null);
  const [newBuyState, setNewBuyState] = useState<string>('');
  const [newCourierPartner, setNewCourierPartner] = useState<string>('');
  const [newTrackingNumber, setNewTrackingNumber] = useState<string>('');

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'flat' | 'percentage'>('flat');
  const [newCouponVal, setNewCouponVal] = useState<string | number>('');
  const [newCouponMin, setNewCouponMin] = useState<string | number>(0);
  const [newCouponMax, setNewCouponMax] = useState<string | number>('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  // Products filter state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productConditionFilter, setProductConditionFilter] = useState('all');

  // Product Add/Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalTab, setProductModalTab] = useState<'general' | 'pricing' | 'media' | 'specs' | 'seo'>('general');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Form Fields - Basic
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formBrand, setFormBrand] = useState('Apple');
  const [formCategory, setFormCategory] = useState('new-phone');
  const [formConditionType, setFormConditionType] = useState<'new' | 'refurbished' | 'old'>('new');
  const [formPrice, setFormPrice] = useState<string | number>('');
  const [formMrp, setFormMrp] = useState<string | number>('');
  const [formOfferText, setFormOfferText] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState<string | number>(5);
  const [formWarranty, setFormWarranty] = useState<string | number>(12);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);

  // Specs
  const [formRam, setFormRam] = useState('');
  const [formStorage, setFormStorage] = useState('');
  const [formColor, setFormColor] = useState('');
  const [formScreen, setFormScreen] = useState('');
  const [formProcessor, setFormProcessor] = useState('');
  const [formCamera, setFormCamera] = useState('');
  const [formBattery, setFormBattery] = useState('');
  const [formHighlights, setFormHighlights] = useState('');

  // SEO Fields
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDescription, setFormSeoDescription] = useState('');
  const [formSeoKeywords, setFormSeoKeywords] = useState('');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');
  const [formOgImage, setFormOgImage] = useState('');

  // Quick State update modal or action for orders
  const [selectedSellOrder, setSelectedSellOrder] = useState<SellOrder | null>(null);
  const [newExecutiveName, setNewExecutiveName] = useState('');
  const [newExecutivePhone, setNewExecutivePhone] = useState('');
  const [newState, setNewState] = useState<string>('');
  const [revisedPrice, setRevisedPrice] = useState<number>(0);

  // Editable pricing base tables
  const [modelsList, setModelsList] = useState<DeviceModel[]>(MODELS);
  const [editingVariant, setEditingVariant] = useState<{ modelId: string; variantId: string; price: number } | null>(null);

  const fetchAllData = async () => {
    try {
      const [sellRes, buyRes, prodRes, coupRes, catRes] = await Promise.all([
        fetch('/api/v1/orders/sell'),
        fetch('/api/v1/orders/buy'),
        fetch('/api/v1/products'),
        fetch('/api/v1/coupons?admin=true'),
        fetch('/api/v1/categories'),
      ]);
      const sellData = await sellRes.json();
      const buyData = await buyRes.json();
      const prodData = await prodRes.json();
      const coupData = await coupRes.json();
      const catData = await catRes.json();

      if (sellData.success) setSellOrders(sellData.data);
      if (buyData.success) setBuyOrders(buyData.data);
      if (prodData.success) setProducts(prodData.data);
      if (coupData.success) setCoupons(coupData.coupons);
      if (catData.success && Array.isArray(catData.categories)) {
        setCategoriesList(catData.categories);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const autoGenerateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newCategoryInput.trim();
    if (!cat) return;
    setIsAddingCategory(true);
    try {
      const res = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat }),
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.categories)) {
          setCategoriesList(data.categories);
        } else {
          setCategoriesList((prev) => Array.from(new Set([...prev, data.category])));
        }
        setFormCategory(data.category);
        setNewCategoryInput('');
        setIsAddCategoryModalOpen(false);
      } else {
        alert(data.message || 'Failed to add category');
      }
    } catch {
      alert('Error adding category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductModalTab('general');
    setFormName('');
    setFormSlug('');
    setFormBrand('Apple');
    setFormCategory('new-phone');
    setFormConditionType('new');
    setFormPrice('');
    setFormMrp('');
    setFormOfferText('Special Offer • Save Big on Pre-order');
    setFormDescription('');
    setFormStock(5);
    setFormWarranty(12);
    setFormFeatured(false);
    setFormImages([]);
    setImageUrlInput('');
    setFormRam('8GB');
    setFormStorage('256GB');
    setFormColor('');
    setFormScreen('');
    setFormProcessor('');
    setFormCamera('');
    setFormBattery('');
    setFormHighlights('100% Genuine Box Pack\nOfficial Brand Warranty\nExpress Doorstep Delivery');
    setFormSeoTitle('');
    setFormSeoDescription('');
    setFormSeoKeywords('');
    setFormCanonicalUrl('');
    setFormOgImage('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: any) => {
    setEditingProduct(product);
    setProductModalTab('general');
    setFormName(product.name || '');
    setFormSlug(product.slug || autoGenerateSlug(product.name || ''));
    setFormBrand(product.brand || 'Apple');
    setFormCategory(product.category || product.categoryGroup || 'new-phone');
    setFormConditionType(product.conditionType || 'new');
    setFormPrice(product.price || product.grades?.[0]?.price || '');
    setFormMrp(product.originalMrp || product.grades?.[0]?.originalMrp || '');
    setFormOfferText(product.offerText || '');
    setFormDescription(product.description || '');
    setFormStock(product.stock || product.grades?.[0]?.stock || 5);
    setFormWarranty(product.warrantyMonths || 12);
    setFormFeatured(Boolean(product.featured));
    setFormImages(Array.isArray(product.images) ? [...product.images] : []);
    setImageUrlInput('');

    const s = product.specs || {};
    setFormRam(s.ram || '');
    setFormStorage(s.storage || '');
    setFormColor(s.color || '');
    setFormScreen(s.screen || '');
    setFormProcessor(s.processor || '');
    setFormCamera(s.camera || '');
    setFormBattery(s.battery || '');
    setFormHighlights(
      Array.isArray(product.highlights) ? product.highlights.join('\n') : ''
    );

    // Populate SEO
    const seo = product.seo || {};
    setFormSeoTitle(seo.title || product.name || '');
    setFormSeoDescription(seo.description || product.description || '');
    setFormSeoKeywords(
      Array.isArray(seo.keywords)
        ? seo.keywords.join(', ')
        : typeof seo.keywords === 'string'
        ? seo.keywords
        : ''
    );
    setFormCanonicalUrl(seo.canonicalUrl || (product.slug ? `/buy/${product.slug}` : ''));
    setFormOgImage(seo.ogImage || product.images?.[0] || '');

    setIsProductModalOpen(true);
  };

  // Image Upload handler (Multiple files supported)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('images', file));

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        setFormImages((prev) => [...prev, ...data.urls]);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch {
      alert('Error uploading images');
    } finally {
      setIsUploadingImages(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setFormImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      alert('Please fill product name and selling price.');
      return;
    }

    setIsSavingProduct(true);
    try {
      const price = Number(formPrice);
      const originalMrp = Number(formMrp) || price;
      const discountPercent =
        originalMrp > price ? Math.round(((originalMrp - price) / originalMrp) * 100) : 0;

      const slug = formSlug.trim()
        ? autoGenerateSlug(formSlug)
        : autoGenerateSlug(formName);

      const seo = {
        title: formSeoTitle.trim() || formName.trim(),
        description: formSeoDescription.trim() || formDescription.trim() || `${formName.trim()} with 12-month warranty on SELBAR.`,
        keywords: formSeoKeywords
          ? formSeoKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [formBrand, formCategory, formName],
        canonicalUrl: formCanonicalUrl.trim() || `/buy/${slug}`,
        ogImage: formOgImage.trim() || formImages[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        metaRobots: 'index, follow',
      };

      const payload = {
        name: formName.trim(),
        slug,
        brand: formBrand,
        category: formCategory,
        conditionType: formConditionType,
        categoryGroup: formCategory,
        price,
        originalMrp,
        discountPercent,
        offerText: formOfferText.trim(),
        description: formDescription.trim(),
        stock: Number(formStock) || 1,
        warrantyMonths: Number(formWarranty) || 12,
        featured: formFeatured,
        images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
        seo,
        specs: {
          ram: formRam.trim(),
          storage: formStorage.trim(),
          color: formColor.trim(),
          screen: formScreen.trim(),
          processor: formProcessor.trim(),
          camera: formCamera.trim(),
          battery: formBattery.trim(),
        },
        highlights: formHighlights
          .split('\n')
          .map((h) => h.trim())
          .filter(Boolean),
      };

      if (editingProduct) {
        const res = await fetch(`/api/v1/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.data : p))
          );
          setIsProductModalOpen(false);
        } else {
          alert(data.message || 'Failed to update product');
        }
      } else {
        const res = await fetch('/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.data, ...prev]);
          setIsProductModalOpen(false);
        } else {
          alert(data.message || 'Failed to create product');
        }
      }
    } catch {
      alert('Network error while saving product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch {
      alert('Error deleting product');
    }
  };

  const handleUpdateSellOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellOrder) return;

    const payload: any = {};
    if (newState) payload.state = newState;
    if (newExecutiveName || newExecutivePhone) {
      payload.executive = {
        name: newExecutiveName || selectedSellOrder.executive?.name,
        phone: newExecutivePhone || selectedSellOrder.executive?.phone,
      };
    }
    if (revisedPrice > 0) {
      payload.revisedPrice = revisedPrice;
      payload.actualPaidPrice = revisedPrice;
    }

    try {
      const res = await fetch(`/api/v1/orders/sell/${selectedSellOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSellOrders((prev) =>
          prev.map((o) => (o.id === selectedSellOrder.id ? data.data : o))
        );
        setSelectedSellOrder(null);
      }
    } catch {
      alert('Failed to update order');
    }
  };

  const handleUpdateBuyOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyOrder) return;
    try {
      const res = await fetch(`/api/v1/orders/buy/${selectedBuyOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: newBuyState,
          courierPartner: newCourierPartner,
          trackingNumber: newTrackingNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBuyOrders((prev) =>
          prev.map((o) => (o.id === selectedBuyOrder.id ? data.data : o))
        );
        setSelectedBuyOrder(null);
      } else {
        alert(data.error || 'Failed to update buy order');
      }
    } catch {
      alert('Network error updating buy order');
    }
  };

  const handleUpdateReturnStatus = async (orderId: string, returnStatus: string, adminNotes?: string) => {
    try {
      const order = buyOrders.find((o) => o.id === orderId);
      if (!order || !order.returnRequest) return;
      const updatedReturn = {
        ...order.returnRequest,
        status: returnStatus,
        adminNotes: adminNotes || order.returnRequest.adminNotes,
        updatedAt: new Date().toISOString(),
      };
      const res = await fetch(`/api/v1/orders/buy/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnRequest: updatedReturn,
          state: returnStatus === 'COMPLETED' ? 'REFUNDED' : order.state,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBuyOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.data : o))
        );
      }
    } catch {
      alert('Error updating return request status');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponVal) {
      alert('Code and discount value are required');
      return;
    }
    setIsCreatingCoupon(true);
    try {
      const res = await fetch('/api/v1/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          code: newCouponCode.trim().toUpperCase(),
          discountType: newCouponType,
          discountValue: Number(newCouponVal),
          minOrderValue: Number(newCouponMin) || 0,
          maxDiscount: newCouponMax ? Number(newCouponMax) : undefined,
          description: newCouponDesc.trim() || `Instant discount with ${newCouponCode.toUpperCase()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => [data.coupon, ...prev]);
        setNewCouponCode('');
        setNewCouponVal('');
        setNewCouponDesc('');
      } else {
        alert(data.message || 'Failed to create coupon');
      }
    } catch {
      alert('Network error creating coupon');
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (id: string) => {
    try {
      const res = await fetch('/api/v1/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? data.coupon : c))
        );
      }
    } catch {
      alert('Error toggling coupon status');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/v1/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      alert('Error deleting coupon');
    }
  };


  const handleSaveBasePrice = (modelId: string, variantId: string, newPrice: number) => {
    setModelsList((prev) =>
      prev.map((m) => {
        if (m.id === modelId) {
          return {
            ...m,
            variants: m.variants.map((v) => (v.id === variantId ? { ...v, basePrice: newPrice } : v)),
          };
        }
        return m;
      })
    );
    setEditingVariant(null);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug?.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      productCategoryFilter === 'all' ||
      p.category === productCategoryFilter ||
      p.categoryGroup === productCategoryFilter ||
      (productCategoryFilter === 'old-phone' && (!p.categoryGroup && p.category === 'phone'));

    const matchesCondition =
      productConditionFilter === 'all' || p.conditionType === productConditionFilter;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  // Metrics
  const totalSellVolume = sellOrders.reduce((sum, o) => sum + (o.actualPaidPrice || o.quotedPrice), 0);
  const totalBuyGmv = buyOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 1), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>SELBAR Operations & Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Operations & Catalog Command Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time management for Products, Orders, Pricing Engine, Multi-Image Uploads & Inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
          >
            ← View Customer Store
          </Link>
          <button
            onClick={openAddProductModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Live Catalog</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {products.length} Products
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {products.filter((p) => p.conditionType === 'new').length} New •{' '}
            {products.filter((p) => p.conditionType !== 'new').length} Refurbished
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Inventory Value</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            ₹{totalInventoryValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Live stock in warehouse</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Buyback Disbursed</span>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
            ₹{totalSellVolume.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{sellOrders.length} sell orders processed</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Store Sales GMV</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            ₹{totalBuyGmv.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{buyOrders.length} customer purchases</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Orders & Dispatch ({sellOrders.length + buyOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'returns' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>5-Day Returns ({buyOrders.filter((o) => !!o.returnRequest).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'coupons' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Coupons & Offers ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Sales Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'pricing' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Pricing Matrix</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG & INVENTORY MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name, brand, slug..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={productConditionFilter}
                  onChange={(e) => setProductConditionFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="all">All Conditions</option>
                  <option value="new">Brand New (Sealed)</option>
                  <option value="refurbished">Refurbished / Old</option>
                </select>

                <button
                  onClick={openAddProductModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Category Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'new-phone', label: '📱 New Phones' },
                { id: 'old-phone', label: '🔄 Old Phones' },
                { id: 'new-laptop', label: '💻 New Laptops' },
                { id: 'old-laptop', label: '🔄 Old Laptops' },
                { id: 'new-desktop', label: '🖥️ New Desktops' },
                { id: 'old-desktop', label: '🔄 Old Desktops' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setProductCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                    productCategoryFilter === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Products in Catalog ({filteredProducts.length})
              </h2>
              <span className="text-xs text-slate-400">
                Connected to Database • Live Updates Sync Instantly
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Product & Slug</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Condition</th>
                    <th className="pb-3">Price & MRP</th>
                    <th className="pb-3">Stock & Warranty</th>
                    <th className="pb-3">SEO Status</th>
                    <th className="pb-3">Offer Tag</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const price = p.price || p.grades?.[0]?.price || 0;
                    const mrp = p.originalMrp || p.grades?.[0]?.originalMrp || price;
                    const discount =
                      mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                    const thumb = p.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800';

                    return (
                      <tr key={p.id || p.slug} className="hover:bg-slate-50/80 transition">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={thumb}
                              alt={p.name}
                              className="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0"
                            />
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>{p.brand} • {p.specs?.storage || p.specs?.ram || 'Standard'}</span>
                                {p.slug && (
                                  <span className="font-mono text-[#00a599] bg-[#eef7f6] px-1.5 py-0.2 rounded border border-[#00a599]/30">
                                    /buy/{p.slug}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {p.category || p.categoryGroup || 'Gadget'}
                          </span>
                        </td>

                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              p.conditionType === 'new'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.conditionType === 'new' ? 'Brand New' : 'Refurbished'}
                          </span>
                        </td>

                        <td className="py-3">
                          <div className="font-bold text-slate-900">
                            ₹{price.toLocaleString('en-IN')}
                          </div>
                          {discount > 0 && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ₹{mrp.toLocaleString('en-IN')}{' '}
                              <span className="text-rose-600 font-bold ml-1">({discount}% OFF)</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3">
                          <div className="font-semibold text-slate-800">
                            {p.stock || p.grades?.[0]?.stock || 0} in stock
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.warrantyMonths || 12}M Warranty
                          </div>
                        </td>

                        <td className="py-3">
                          {p.seo?.title && p.seo?.description ? (
                            <span
                              className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 flex items-center gap-1 w-fit"
                              title={`Meta Title: ${p.seo.title}`}
                            >
                              <Globe className="w-3 h-3 text-emerald-600" />
                              <span>SEO Ready</span>
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/60 flex items-center gap-1 w-fit"
                              title="Meta description or title is missing. Click edit to configure SEO."
                            >
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>No SEO</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3">
                          {p.offerText ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Tag className="w-3 h-3" />
                              <span className="line-clamp-1 max-w-[130px]">{p.offerText}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px]">—</span>
                          )}
                        </td>

                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/buy/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition"
                              title="View on Store"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Package className="w-8 h-8 mx-auto text-slate-300" />
                  <div>No products found matching your search or filters.</div>
                  <button
                    onClick={openAddProductModal}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    + Add Product Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Active Sell Orders (Doorstep Buybacks)</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Device</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Slot & Hub</th>
                    <th className="pb-3">Payout</th>
                    <th className="pb-3">State</th>
                    <th className="pb-3">Executive</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-mono font-bold text-slate-900">#{order.id}</td>
                      <td className="py-3">
                        <div className="font-bold text-slate-800">{order.deviceSummary.model}</div>
                        <div className="text-[10px] text-slate-400">{order.deviceSummary.variant}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-800">{order.customer.name}</div>
                        <div className="text-[10px] text-slate-400">{order.customer.phone}</div>
                      </td>
                      <td className="py-3">
                        <div className="text-slate-700">{order.pickupSlot.date}</div>
                        <div className="text-[10px] text-slate-400">{order.pickupAddress.city}</div>
                      </td>
                      <td className="py-3 font-bold text-emerald-700">
                        ₹{(order.actualPaidPrice || order.quotedPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {order.state}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {order.executive?.name?.split(' ')[0] || 'Unassigned'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedSellOrder(order);
                            setNewState(order.state);
                            setNewExecutiveName(order.executive?.name || '');
                            setNewExecutivePhone(order.executive?.phone || '');
                            setRevisedPrice(order.revisedPrice || order.quotedPrice);
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold"
                        >
                          Manage / Dispatch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Customer Buy Orders Table */}
            <div className="pt-6 border-t border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Customer Buy Orders & Courier Dispatch</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Hub & PIN</th>
                      <th className="pb-3">Total (₹)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Courier / AWB</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {buyOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-slate-900">#{order.id}</td>
                        <td className="py-3">
                          <div className="font-bold text-slate-800">{order.customer.name}</div>
                          <div className="text-[10px] text-slate-400">{order.customer.phone}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-slate-800 truncate max-w-[160px]">
                            {order.items[0]?.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Qty: {order.items.length} {order.protectionPlan ? '• Complete Care' : ''}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-slate-800 font-medium">{order.shippingAddress.city}</div>
                          <div className="text-[10px] text-slate-400">{order.shippingAddress.pincode}</div>
                        </td>
                        <td className="py-3 font-bold text-emerald-700">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.state === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.state === 'RETURN_REQUESTED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.state}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">
                          <div className="font-semibold text-[11px]">{order.courierPartner || 'SELBAR Express'}</div>
                          <div className="text-[10px] font-mono text-slate-400">{order.trackingNumber}</div>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedBuyOrder(order);
                              setNewBuyState(order.state);
                              setNewCourierPartner(order.courierPartner || 'SELBAR Express Doorstep');
                              setNewTrackingNumber(order.trackingNumber);
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold"
                          >
                            Dispatch / Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 5-DAY RETURNS & REPLACEMENTS MANAGEMENT */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  5-Day Return & Replacement Requests (Doorstep Pickups)
                </h2>
                <p className="text-xs text-slate-500">
                  Customers can raise requests within 5 days of delivery. Assign reverse pickup executives across West Champaran.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold">
                {buyOrders.filter((o) => !!o.returnRequest).length} Active Tickets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Ticket ID</th>
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Resolution</th>
                    <th className="pb-3">Reason & Notes</th>
                    <th className="pb-3">Customer & Hub</th>
                    <th className="pb-3">Pickup Slot</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {buyOrders
                    .filter((o) => !!o.returnRequest)
                    .map((order) => {
                      const ret = order.returnRequest!;
                      return (
                        <tr key={ret.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-mono font-bold text-slate-900">#{ret.id}</td>
                          <td className="py-3 font-mono text-slate-600">#{order.id}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                ret.type === 'REPLACEMENT'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ret.type}
                            </span>
                          </td>
                          <td className="py-3 max-w-xs">
                            <div className="font-bold text-slate-900">{ret.reason}</div>
                            {ret.notes && (
                              <div className="text-[10px] text-slate-500 truncate">{ret.notes}</div>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="font-semibold text-slate-800">{order.customer.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {order.customer.phone} • {order.shippingAddress.city}
                            </div>
                          </td>
                          <td className="py-3 text-slate-700">
                            <div>{ret.pickupSlot.date}</div>
                            <div className="text-[10px] text-slate-400">{ret.pickupSlot.window}</div>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              {ret.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            {ret.status === 'REQUESTED' && (
                              <button
                                onClick={() => handleUpdateReturnStatus(order.id, 'PICKUP_SCHEDULED')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                              >
                                Approve Pickup
                              </button>
                            )}
                            {ret.status === 'PICKUP_SCHEDULED' && (
                              <button
                                onClick={() => handleUpdateReturnStatus(order.id, 'PICKED_UP')}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                              >
                                Mark Picked Up
                              </button>
                            )}
                            {(ret.status === 'PICKED_UP' || ret.status === 'INSPECTED') && (
                              <button
                                onClick={() => handleUpdateReturnStatus(order.id, 'COMPLETED')}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold"
                              >
                                Complete & Close
                              </button>
                            )}
                            {ret.status !== 'REJECTED' && ret.status !== 'COMPLETED' && (
                              <button
                                onClick={() => handleUpdateReturnStatus(order.id, 'REJECTED')}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {buyOrders.filter((o) => !!o.returnRequest).length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-1">
                  <RotateCcw className="w-8 h-8 mx-auto text-slate-300" />
                  <div>No return or replacement tickets currently active.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS & DISCOUNTS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Coupon Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>Create New Coupon Code</span>
              </h2>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CHAMPARAN500"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold uppercase bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold"
                    >
                      <option value="flat">Flat (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {newCouponType === 'flat' ? 'Amount (₹) *' : 'Discount (%) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 500"
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 9999"
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 1500"
                      value={newCouponMax}
                      onChange={(e) => setNewCouponMax(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat ₹500 off on all orders above ₹9,999"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCoupon}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
                >
                  {isCreatingCoupon ? 'Creating...' : '+ Add Coupon'}
                </button>
              </form>
            </div>

            {/* Existing Coupons List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Active Coupons ({coupons.length})</h2>

              <div className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{c.description}</p>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Min Order: ₹{c.minOrderValue.toLocaleString('en-IN')} • Value:{' '}
                        {c.discountType === 'flat' ? `₹${c.discountValue}` : `${c.discountValue}%`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCoupon(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                          c.isActive
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SALES & E-COMMERCE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Buy GMV</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{buyOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">Delivered Recommerce Sales</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Order Value (AOV)</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{buyOrders.length > 0
                  ? Math.round(buyOrders.reduce((sum, o) => sum + o.totalAmount, 0) / buyOrders.length).toLocaleString('en-IN')
                  : '0'}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Per customer purchase</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">5-Day Return Rate</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {buyOrders.length > 0
                  ? ((buyOrders.filter((o) => !!o.returnRequest).length / buyOrders.length) * 100).toFixed(1)
                  : '0.0'}%
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Within 5-day guarantee window</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sell Volume</span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                ₹{sellOrders.reduce((sum, o) => sum + (o.actualPaidPrice || o.quotedPrice), 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Doorstep buyback payouts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Payment Methods Breakdown</h3>
              <div className="space-y-3 text-xs">
                {['UPI', 'Credit/Debit Card', 'NetBanking', 'Cash on Delivery'].map((m) => {
                  const count = buyOrders.filter((o) => o.paymentMethod === m).length;
                  const pct = buyOrders.length > 0 ? Math.round((count / buyOrders.length) * 100) : 0;
                  return (
                    <div key={m} className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-700">{m}</span>
                        <span className="text-slate-900 font-bold">{count} orders ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Target Region Hub Performance</h3>
              <div className="space-y-2 text-xs">
                {['Bettiah', 'Bagaha', 'Narkatiaganj', 'Ramnagar', 'Lauriya', 'Valmikinagar'].map((city) => {
                  const cityOrders = buyOrders.filter((o) => o.shippingAddress?.city === city).length;
                  return (
                    <div key={city} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="font-semibold text-slate-800">{city} (West Champaran)</span>
                      <span className="font-bold text-emerald-700">{cityOrders} Orders</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PRICING ENGINE CONFIGURATOR */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Base Price Matrix by Device & Variant</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates apply to all subsequent customer quotes instantly without code deploys.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {modelsList.map((model) => (
              <div key={model.id} className="py-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>{model.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">({model.brandId})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {model.variants.map((v) => {
                    const isEditing = editingVariant?.modelId === model.id && editingVariant?.variantId === v.id;

                    return (
                      <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-800">{v.storage} {v.ram ? `(${v.ram})` : ''}</span>
                          <div className="text-[11px] font-bold text-emerald-700">
                            ₹{v.basePrice.toLocaleString('en-IN')}
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              defaultValue={v.basePrice}
                              id={`input-${v.id}`}
                              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`input-${v.id}`) as HTMLInputElement;
                                if (input) {
                                  handleSaveBasePrice(model.id, v.id, Number(input.value));
                                }
                              }}
                              className="p-1 bg-emerald-600 text-white rounded"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingVariant({ modelId: model.id, variantId: v.id, price: v.basePrice })}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#00a599] uppercase tracking-wider">
                  Admin Product Management CMS
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Database'}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage title, custom slug/URL, dynamic categories, images, pricing, specs, and complete Google SEO.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR BAR */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl overflow-x-auto scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setProductModalTab('general')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  productModalTab === 'general'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-[#00a599]" />
                <span>1. General & Slug</span>
              </button>

              <button
                type="button"
                onClick={() => setProductModalTab('pricing')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  productModalTab === 'pricing'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#00a599]" />
                <span>2. Pricing & Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setProductModalTab('media')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  productModalTab === 'media'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#00a599]" />
                <span>3. Media Gallery ({formImages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductModalTab('specs')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  productModalTab === 'specs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#00a599]" />
                <span>4. Specs & Info</span>
              </button>

              <button
                type="button"
                onClick={() => setProductModalTab('seo')}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  productModalTab === 'seo'
                    ? 'bg-[#00a599] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>5. SEO & Google SERP</span>
                {formSeoTitle && formSeoDescription && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* =============================================================
                  TAB 1: GENERAL & SLUG / URL CONFIGURATION
                  ============================================================= */}
              {productModalTab === 'general' && (
                <div className="space-y-4 animate-in fade-in-0 duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Product Title */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">
                        Product Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple iPhone 15 Pro Max 256GB Natural Titanium"
                        value={formName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormName(val);
                          if (!editingProduct) {
                            setFormSlug(autoGenerateSlug(val));
                            if (!formSeoTitle) {
                              setFormSeoTitle(val);
                            }
                          }
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a599] text-slate-900 font-semibold"
                      />
                    </div>

                    {/* Product Slug / URL */}
                    <div className="sm:col-span-2 p-3.5 rounded-2xl bg-teal-50/60 border border-[#00a599]/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-[#00a599]" />
                          <span>Product Slug / Custom URL Path *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormSlug(autoGenerateSlug(formName))}
                          className="text-[11px] font-bold text-[#00a599] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auto-Generate from Title</span>
                        </button>
                      </div>

                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-slate-200/80 text-slate-600 rounded-l-xl border-y border-l border-slate-300 font-mono text-[11px] select-none">
                          https://selbar.in/buy/
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. apple-iphone-15-pro-max"
                          value={formSlug}
                          onChange={(e) => setFormSlug(autoGenerateSlug(e.target.value))}
                          className="flex-1 px-3 py-2.5 border border-slate-300 rounded-r-xl bg-white font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00a599]"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        This creates a clean, SEO-optimized URL for your product. Accessible at <code className="text-[#00a599]">/buy/{formSlug || 'product-slug'}</code>
                      </p>
                    </div>

                    {/* Category Selection with Custom Category Adder */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-800">
                          Product Category *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsAddCategoryModalOpen(true)}
                          className="text-[10px] font-extrabold text-[#00a599] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Custom Category</span>
                        </button>
                      </div>

                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-[#00a599]"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace(/-/g, ' ').toUpperCase()} ({cat})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Selection */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Brand *</label>
                      <select
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-[#00a599]"
                      >
                        {['Apple', 'Samsung', 'OnePlus', 'HP', 'Lenovo', 'Dell', 'ASUS', 'Xiaomi', 'Google', 'Nothing', 'Sony', 'Boat', 'Noise', 'Realme'].map(
                          (b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Condition Type */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Device Condition</label>
                      <div className="flex items-center gap-3 pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="condition"
                            checked={formConditionType === 'new'}
                            onChange={() => setFormConditionType('new')}
                            className="accent-emerald-600"
                          />
                          <span className="font-bold text-emerald-800">Brand New (Box Pack)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="condition"
                            checked={formConditionType === 'refurbished'}
                            onChange={() => setFormConditionType('refurbished')}
                            className="accent-teal-600"
                          />
                          <span className="font-bold text-teal-800">Refurbished</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="condition"
                            checked={formConditionType === 'old'}
                            onChange={() => setFormConditionType('old')}
                            className="accent-slate-600"
                          />
                          <span className="font-bold text-slate-800">Used / Old</span>
                        </label>
                      </div>
                    </div>

                    {/* Homepage Feature Toggle */}
                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#00a599] rounded cursor-pointer"
                      />
                      <label htmlFor="featured-check" className="font-semibold text-slate-800 cursor-pointer">
                        Feature on Homepage / Super Deals Banner
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 2: PRICING, STOCK & OFFERS
                  ============================================================= */}
              {productModalTab === 'pricing' && (
                <div className="space-y-4 animate-in fade-in-0 duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 54999"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-black text-slate-900 text-sm focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Original MRP / Showroom Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 79900"
                        value={formMrp}
                        onChange={(e) => setFormMrp(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-600 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Calculated Savings</label>
                      <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/60 font-bold text-emerald-800 flex items-center justify-between">
                        <span>
                          {Number(formMrp) > Number(formPrice) && Number(formPrice) > 0
                            ? `${Math.round(((Number(formMrp) - Number(formPrice)) / Number(formMrp)) * 100)}% OFF`
                            : 'No Discount'}
                        </span>
                        {Number(formMrp) > Number(formPrice) && (
                          <span className="text-emerald-700 text-[10px]">
                            Save ₹{(Number(formMrp) - Number(formPrice)).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Units in Stock *</label>
                      <input
                        type="number"
                        min={0}
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Warranty Period (Months)</label>
                      <input
                        type="number"
                        min={0}
                        value={formWarranty}
                        onChange={(e) => setFormWarranty(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-bold text-slate-800 mb-1">Special Offer / Promotion Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Festive Super Deal • Extra ₹2,000 Off on UPI + Free Doorstep Delivery"
                        value={formOfferText}
                        onChange={(e) => setFormOfferText(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 3: MEDIA & PRODUCT IMAGES
                  ============================================================= */}
              {productModalTab === 'media' && (
                <div className="space-y-4 animate-in fade-in-0 duration-150">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-dashed border-slate-300 hover:border-[#00a599] rounded-2xl cursor-pointer bg-slate-50 hover:bg-[#eef7f6]/60 transition">
                      <Upload className="w-4 h-4 text-[#00a599]" />
                      <span className="font-bold text-slate-700">
                        {isUploadingImages ? 'Uploading Files...' : 'Upload Images from Computer (Multiple)'}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploadingImages}
                      />
                    </label>

                    <div className="flex items-center gap-1.5 w-full sm:w-96">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3.5 py-2.5 bg-slate-900 hover:bg-[#00a599] text-white rounded-xl font-bold transition shrink-0 cursor-pointer"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Images Preview Gallery */}
                  {formImages.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>Total {formImages.length} images added. The first image will be used as the primary cover.</span>
                        <span className="text-[#00a599] font-bold">Click "Cover" to make primary</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        {formImages.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative group rounded-xl overflow-hidden bg-white border h-28 flex flex-col items-center justify-between p-1.5 transition ${
                              idx === 0 ? 'border-[#00a599] ring-2 ring-[#00a599]/20 shadow-xs' : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                              <img src={img} alt={`Product ${idx}`} className="max-h-full max-w-full object-contain" />
                            </div>

                            <div className="w-full flex items-center justify-between pt-1 border-t border-slate-100">
                              {idx === 0 ? (
                                <span className="px-1.5 py-0.5 rounded bg-[#00a599] text-white text-[8px] font-black uppercase tracking-wider">
                                  Cover
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(idx)}
                                  className="text-[9px] font-bold text-slate-500 hover:text-[#00a599] transition cursor-pointer"
                                >
                                  Make Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                title="Remove image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p>No images added yet. Upload files or paste URLs above.</p>
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
                  TAB 4: SPECIFICATIONS & HIGHLIGHTS
                  ============================================================= */}
              {productModalTab === 'specs' && (
                <div className="space-y-4 animate-in fade-in-0 duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">RAM</label>
                      <input
                        type="text"
                        placeholder="e.g. 8GB / 16GB Unified"
                        value={formRam}
                        onChange={(e) => setFormRam(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Storage</label>
                      <input
                        type="text"
                        placeholder="e.g. 256GB / 512GB NVMe"
                        value={formStorage}
                        onChange={(e) => setFormStorage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Color / Finish</label>
                      <input
                        type="text"
                        placeholder="e.g. Natural Titanium"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Processor</label>
                      <input
                        type="text"
                        placeholder="e.g. Apple A17 Pro (3nm)"
                        value={formProcessor}
                        onChange={(e) => setFormProcessor(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Screen / Display</label>
                      <input
                        type="text"
                        placeholder='e.g. 6.7" Super Retina XDR OLED (120Hz ProMotion)'
                        value={formScreen}
                        onChange={(e) => setFormScreen(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Battery</label>
                      <input
                        type="text"
                        placeholder="e.g. 4422 mAh (90%+ Health)"
                        value={formBattery}
                        onChange={(e) => setFormBattery(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Camera</label>
                      <input
                        type="text"
                        placeholder="e.g. 48MP Quad-Pixel + 5x Zoom"
                        value={formCamera}
                        onChange={(e) => setFormCamera(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Product Description</label>
                      <textarea
                        rows={4}
                        placeholder="Describe device condition, warranty details, certification notes, and box contents..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Key Highlights (One bullet per line)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="100% Genuine Certified Hardware&#10;12 Months Assured Warranty&#10;NIST 800-88 Data Sanitized&#10;Free Express Doorstep Delivery"
                        value={formHighlights}
                        onChange={(e) => setFormHighlights(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 5: COMPLETE SEO SUITE & GOOGLE SERP PREVIEW
                  ============================================================= */}
              {productModalTab === 'seo' && (
                <div className="space-y-5 animate-in fade-in-0 duration-150">
                  {/* Google SERP Live Simulation Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-black text-slate-900 text-xs uppercase tracking-wider">
                          Google Search Result (SERP) Live Preview
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">Real-time simulation</span>
                    </div>

                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1">
                      {/* Google Breadcrumb URL */}
                      <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                        <div className="w-4 h-4 rounded-full bg-[#00a599] text-white text-[9px] font-black flex items-center justify-center">
                          S
                        </div>
                        <span className="font-medium text-slate-800">SELBAR Recommerce</span>
                        <span className="text-slate-400">› buy › {formSlug || 'product-slug'}</span>
                      </div>

                      {/* Google Title Link */}
                      <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
                        {formSeoTitle || formName || 'Buy Certified Refurbished Gadgets Online - SELBAR India'}
                      </h4>

                      {/* Google Description Snippet */}
                      <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                        {formSeoDescription ||
                          formDescription ||
                          `Buy ${formName || 'certified tech'} with 12 months warranty, 32-point diagnostics inspection, and free express delivery across India on SELBAR.`}
                      </p>
                    </div>
                  </div>

                  {/* SEO Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Meta Title */}
                    <div className="sm:col-span-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-xs">
                          SEO Meta Title (Title Tag)
                        </label>
                        <span
                          className={`text-[10px] font-bold ${
                            formSeoTitle.length > 60
                              ? 'text-rose-600'
                              : formSeoTitle.length >= 40
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {formSeoTitle.length}/60 chars ({formSeoTitle.length > 60 ? 'Too Long' : formSeoTitle.length >= 40 ? 'Optimal' : 'Short'})
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Buy Refurbished iPhone 15 Pro Max (Grade A) • 1-Yr Warranty | SELBAR"
                        value={formSeoTitle}
                        onChange={(e) => setFormSeoTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="sm:col-span-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-xs">
                          SEO Meta Description
                        </label>
                        <span
                          className={`text-[10px] font-bold ${
                            formSeoDescription.length > 160
                              ? 'text-rose-600'
                              : formSeoDescription.length >= 120
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {formSeoDescription.length}/160 chars ({formSeoDescription.length > 160 ? 'Too Long' : formSeoDescription.length >= 120 ? 'Optimal' : 'Short'})
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="e.g. Order certified Apple iPhone 15 Pro Max online at lowest price. 100% genuine OEM parts, 32-point inspection, 12 months full warranty, and free COD delivery."
                        value={formSeoDescription}
                        onChange={(e) => setFormSeoDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs text-slate-800 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    {/* Focus Keywords */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Focus SEO Keywords (Comma Separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. refurbished iphone, iphone 15 pro max, buy old phone, certified recommerce"
                        value={formSeoKeywords}
                        onChange={(e) => setFormSeoKeywords(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs text-slate-800 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Canonical URL (Optional Override)
                      </label>
                      <input
                        type="text"
                        placeholder={`/buy/${formSlug || 'product-slug'}`}
                        value={formCanonicalUrl}
                        onChange={(e) => setFormCanonicalUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono text-slate-800 focus:ring-2 focus:ring-[#00a599]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {productModalTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'general' | 'pricing' | 'media' | 'specs' | 'seo'> = ['general', 'pricing', 'media', 'specs', 'seo'];
                        const idx = tabs.indexOf(productModalTab);
                        if (idx > 0) setProductModalTab(tabs[idx - 1]);
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer text-xs"
                    >
                      ← Previous Tab
                    </button>
                  )}
                  {productModalTab !== 'seo' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'general' | 'pricing' | 'media' | 'specs' | 'seo'> = ['general', 'pricing', 'media', 'specs', 'seo'];
                        const idx = tabs.indexOf(productModalTab);
                        if (idx < tabs.length - 1) setProductModalTab(tabs[idx + 1]);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer text-xs"
                    >
                      Next Tab →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-6 py-2.5 rounded-xl bg-[#00a599] hover:bg-[#008f84] text-white font-extrabold transition shadow-md shadow-teal-500/20 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {isSavingProduct
                        ? 'Saving to Database...'
                        : editingProduct
                        ? 'Update & Save to Database'
                        : 'Create Product & Save to Database'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MINI MODAL: ADD CUSTOM CATEGORY */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00a599]" />
                <span>Add New Product Category</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming Consoles, Smart Audio, Drones"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold focus:ring-2 focus:ring-[#00a599]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Will be saved as slug: <code className="text-[#00a599]">{autoGenerateSlug(newCategoryInput) || 'category-slug'}</code>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCategory}
                  className="px-5 py-2 rounded-xl bg-[#00a599] hover:bg-[#008f84] text-white font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isAddingCategory ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE ORDER MODAL */}
      {selectedSellOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Manage Order #{selectedSellOrder.id}
            </h3>

            <form onSubmit={handleUpdateSellOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Update Status</label>
                <select
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="PICKUP_SCHEDULED">PICKUP_SCHEDULED</option>
                  <option value="EXECUTIVE_ASSIGNED">EXECUTIVE_ASSIGNED</option>
                  <option value="INSPECTED">INSPECTED</option>
                  <option value="PAID">PAID (Payment Disbursed)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Field Executive</label>
                <input
                  type="text"
                  placeholder="Executive Full Name"
                  value={newExecutiveName}
                  onChange={(e) => setNewExecutiveName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white mb-2"
                />
                <input
                  type="tel"
                  placeholder="Executive Phone"
                  value={newExecutivePhone}
                  onChange={(e) => setNewExecutivePhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Revised Payout Price (₹)</label>
                <input
                  type="number"
                  value={revisedPrice}
                  onChange={(e) => setRevisedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                />
                <span className="text-[10px] text-slate-400">
                  Initial Quoted: ₹{selectedSellOrder.quotedPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSellOrder(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE BUY ORDER DISPATCH MODAL */}
      {selectedBuyOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Dispatch & Update Buy Order #{selectedBuyOrder.id}
            </h3>

            <form onSubmit={handleUpdateBuyOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shipment Status</label>
                <select
                  value={newBuyState}
                  onChange={(e) => setNewBuyState(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold"
                >
                  <option value="PLACED">PLACED (Order Received)</option>
                  <option value="PACKED">PACKED (32-Point QC Passed)</option>
                  <option value="SHIPPED">SHIPPED (In Transit with Courier)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED (5-Day Return Window Active)</option>
                  <option value="RETURN_REQUESTED">RETURN_REQUESTED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Courier Partner</label>
                <input
                  type="text"
                  placeholder="e.g. SELBAR Express Doorstep / Bluedart"
                  value={newCourierPartner}
                  onChange={(e) => setNewCourierPartner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tracking AWB Number</label>
                <input
                  type="text"
                  placeholder="e.g. SEL-EXP-9823910"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                <span className="font-bold block text-slate-800">Customer Shipping Address:</span>
                <span>{selectedBuyOrder.shippingAddress.flatNo}, {selectedBuyOrder.shippingAddress.street}, {selectedBuyOrder.shippingAddress.city} - {selectedBuyOrder.shippingAddress.pincode}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBuyOrder(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Save Dispatch Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
