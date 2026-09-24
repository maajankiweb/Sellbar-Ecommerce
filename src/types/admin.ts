export type RoleType = 
  | 'Super Admin' 
  | 'Admin' 
  | 'Manager' 
  | 'Product Manager' 
  | 'Order Manager' 
  | 'Marketing Manager' 
  | 'Support Agent' 
  | 'Content Manager';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve';

export interface PermissionModule {
  module: string;
  label: string;
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    approve?: boolean;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  avatar: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export type ProductStatus = 'published' | 'draft' | 'scheduled' | 'out_of_stock' | 'archived';

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  attributes: Record<string, string>; // e.g. { size: 'M', color: 'Midnight Black', storage: '256GB' }
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  image?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  compareAtPrice: number;
  costPrice: number;
  taxRate: number;
  taxClass: string;
  stock: number;
  lowStockThreshold: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  trackInventory: boolean;
  allowBackorders: boolean;
  images: string[];
  variants: ProductVariant[];
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  shippingClass: string;
  tags: string[];
  status: ProductStatus;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Processing' 
  | 'Packed' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned' 
  | 'Refunded' 
  | 'Failed';

export type PaymentMethod = 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Net Banking' | 'Wallet' | 'Razorpay' | 'Stripe' | 'PayPal';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  image: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerAddress {
  fullName: string;
  street: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  status: OrderStatus;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  status: OrderStatus;
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  timeline: OrderTimelineEvent[];
  carrier?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  group: 'Regular' | 'VIP' | 'Wholesale' | 'New' | 'Blocked';
  status: 'active' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  addresses: CustomerAddress[];
  createdAt: string;
  lastOrderDate: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  category: string;
  image: string;
  stock: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  unitCost: number;
  totalValue: number;
  lastRestocked: string;
}

export interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit: number;
  perCustomerLimit: number;
  startDate: string;
  endDate: string;
  applicableCategory?: string;
  status: 'active' | 'scheduled' | 'expired' | 'disabled';
}

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  reviewTitle: string;
  reviewBody: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'reported';
  createdAt: string;
  reply?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'Google Ads' | 'Meta' | 'Email' | 'Influencer' | 'SMS' | 'Affiliate';
  budget: number;
  spend: number;
  revenue: number;
  roas: number;
  orders: number;
  conversionRate: number;
  status: 'active' | 'completed' | 'paused' | 'draft';
  startDate: string;
  endDate: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'Order Issue' | 'Payment Failure' | 'Refund Status' | 'Product Inquiry' | 'Technical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messagesCount: number;
  createdAt: string;
  lastUpdated: string;
}

export interface ActivityLogItem {
  id: string;
  adminName: string;
  adminRole: RoleType;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  timestamp: string;
}

export interface DashboardKPISummary {
  totalRevenue: number;
  revenueChangePct: number;
  totalOrders: number;
  ordersChangePct: number;
  totalCustomers: number;
  customersChangePct: number;
  averageOrderValue: number;
  aovChangePct: number;
  conversionRate: number;
  conversionChangePct: number;
}
