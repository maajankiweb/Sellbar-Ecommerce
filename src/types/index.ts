export type Category = 
  | 'phone' 
  | 'laptop' 
  | 'tablet' 
  | 'smartwatch'
  | 'desktop'
  | 'new-phone'
  | 'old-phone'
  | 'new-laptop'
  | 'old-laptop'
  | 'new-desktop'
  | 'old-desktop';

export type DeviceCondition = 'new' | 'old' | 'refurbished';

export type ConditionGrade = 'fair' | 'good' | 'superb' | 'brand-new';

export type SellOrderState = 
  | 'QUOTED' 
  | 'PICKUP_SCHEDULED' 
  | 'EXECUTIVE_ASSIGNED' 
  | 'INSPECTED' 
  | 'PAID' 
  | 'CANCELLED';

export type BuyOrderState = 
  | 'PLACED' 
  | 'PACKED' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'RETURN_REQUESTED' 
  | 'REFUNDED';

export type DeductionType = 'flat' | 'percent';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category: Category;
  logo: string;
  popular?: boolean;
}

export interface DeviceVariant {
  id: string;
  modelId: string;
  ram: string;
  storage: string;
  basePrice: number;
}

export interface DeviceModel {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  category: Category;
  imageUrl: string;
  variants: DeviceVariant[];
  releaseYear?: number;
  popular?: boolean;
}

export interface ConditionOption {
  id: string;
  label: string;
  description?: string;
  deductionType: DeductionType;
  deductionValue: number; // Flat in INR or percentage (e.g. 15 for 15%)
  icon?: string;
}

export interface ConditionQuestion {
  id: string;
  category: Category;
  title: string;
  description: string;
  type: 'single' | 'multiple';
  options: ConditionOption[];
  orderIndex: number;
}

export interface QuoteBreakdownItem {
  title: string;
  amount: number;
  type: 'base' | 'deduction' | 'bonus';
  note?: string;
}

export interface Quote {
  id: string;
  modelId: string;
  modelName: string;
  brandName: string;
  modelImage: string;
  variantId: string;
  variantText: string;
  basePrice: number;
  finalPrice: number;
  breakdown: QuoteBreakdownItem[];
  conditionAnswers: Record<string, string | string[]>;
  validUntil: string;
  status: 'active' | 'expired' | 'converted';
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  flatNo: string;
  street: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface SellOrder {
  id: string;
  quoteId: string;
  deviceSummary: {
    brand: string;
    model: string;
    variant: string;
    image: string;
  };
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  pickupAddress: Address;
  pickupSlot: {
    date: string;
    window: 'Morning (9 AM - 1 PM)' | 'Afternoon (1 PM - 5 PM)' | 'Evening (5 PM - 8 PM)';
  };
  payoutMode: 'UPI' | 'Bank Transfer' | 'Instant Cash';
  payoutDetails?: {
    upiId?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
  };
  state: SellOrderState;
  quotedPrice: number;
  revisedPrice?: number;
  actualPaidPrice?: number;
  executive?: {
    name: string;
    phone: string;
    photo?: string;
  };
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface RefurbProduct {
  id: string;
  modelId: string;
  brand: string;
  name: string;
  slug: string;
  category: Category;
  images: string[];
  specs: {
    ram: string;
    storage: string;
    color: string;
    screen: string;
    processor: string;
    camera: string;
    battery: string;
  };
  grades: {
    grade: ConditionGrade;
    title: string;
    description: string;
    price: number;
    originalMrp: number;
    stock: number;
  }[];
  warrantyMonths: number;
  replacementDays: number;
  qcPointsCount: number;
  highlights: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  stock?: number;
  conditionType?: 'new' | 'old' | 'refurbished';
  categoryGroup?: 'new-phone' | 'old-phone' | 'new-laptop' | 'old-laptop' | 'new-desktop' | 'old-desktop';
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  grade: ConditionGrade;
  storage: string;
  color: string;
  price: number;
  originalMrp: number;
  quantity: number;
  warrantyMonths: number;
}

export interface BuyOrder {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: Address;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'NetBanking' | 'Cash on Delivery';
  subtotal: number;
  discount: number;
  couponCode?: string;
  protectionPlan?: boolean;
  shippingFee: number;
  totalAmount: number;
  state: BuyOrderState;
  trackingNumber: string;
  courierPartner?: string;
  deliveredAt?: string;
  returnRequest?: ReturnRequest;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  type: 'REPLACEMENT' | 'REFUND';
  reason: string;
  notes?: string;
  pickupSlot: {
    date: string;
    window: string;
  };
  pickupAddress: Address;
  status: 'REQUESTED' | 'PICKUP_SCHEDULED' | 'PICKED_UP' | 'INSPECTED' | 'COMPLETED' | 'REJECTED';
  assignedExecutive?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'flat' | 'percentage';
  discountValue: number; // Flat ₹ or %
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  originalMrp: number;
  grade: ConditionGrade;
  addedAt: string;
}

export interface ServiceabilityResult {
  pincode: string;
  serviceable: boolean;
  city?: string;
  state?: string;
  deliveryDays?: number;
  pickupAvailable?: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  username?: string;
  role?: 'customer' | 'executive' | 'admin' | 'super_admin';
  phoneVerified?: boolean;
  emailVerified?: boolean;
  isMobileVerified?: boolean;
  hasCompletedFirstTimeOtp?: boolean;
  payoutUpi?: string;
  profileCompletionPercent?: number;
  isProfileComplete?: boolean;
  addresses: Address[];
  wishlist?: WishlistItem[];
}


