import {
  AdminProduct,
  AdminOrder,
  CustomerProfile,
  InventoryItem,
  CouponItem,
  ReviewItem,
  MarketingCampaign,
  SupportTicket,
  ActivityLogItem,
  AdminUser,
  DashboardKPISummary,
  OrderStatus,
  ProductStatus
} from '@/types/admin';
import {
  INITIAL_KPI_SUMMARY,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_INVENTORY,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_CAMPAIGNS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ADMIN_USERS
} from './adminMockData';

// In-memory data store with browser localStorage sync where available
class AdminServiceStore {
  private products: AdminProduct[] = [...INITIAL_PRODUCTS];
  private orders: AdminOrder[] = [...INITIAL_ORDERS];
  private customers: CustomerProfile[] = [...INITIAL_CUSTOMERS];
  private inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  private coupons: CouponItem[] = [...INITIAL_COUPONS];
  private reviews: ReviewItem[] = [...INITIAL_REVIEWS];
  private campaigns: MarketingCampaign[] = [...INITIAL_CAMPAIGNS];
  private supportTickets: SupportTicket[] = [...INITIAL_SUPPORT_TICKETS];
  private activityLogs: ActivityLogItem[] = [...INITIAL_ACTIVITY_LOGS];
  private adminUsers: AdminUser[] = [...INITIAL_ADMIN_USERS];
  private kpiSummary: DashboardKPISummary = { ...INITIAL_KPI_SUMMARY };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const storedProducts = localStorage.getItem('selbar_admin_products');
      if (storedProducts) this.products = JSON.parse(storedProducts);

      const storedOrders = localStorage.getItem('selbar_admin_orders');
      if (storedOrders) this.orders = JSON.parse(storedOrders);

      const storedCoupons = localStorage.getItem('selbar_admin_coupons');
      if (storedCoupons) this.coupons = JSON.parse(storedCoupons);
    } catch {
      // Fallback to initial data if storage parse fails
    }
  }

  private saveToStorage(key: string, data: any) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage quota exceeded or error:', e);
    }
  }

  // Dashboard API
  async getDashboardSummary(dateRange: string = '30d'): Promise<DashboardKPISummary> {
    await this.delay(120);
    // Slight variation if range is today vs 30d
    if (dateRange === 'today') {
      return {
        totalRevenue: 64200,
        revenueChangePct: 8.2,
        totalOrders: 28,
        ordersChangePct: 14.5,
        totalCustomers: 12,
        customersChangePct: 4.1,
        averageOrderValue: 2292,
        aovChangePct: 3.1,
        conversionRate: 4.12,
        conversionChangePct: 0.5,
      };
    }
    return { ...this.kpiSummary };
  }

  // Products API
  async getProducts(params?: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: AdminProduct[]; total: number }> {
    await this.delay(150);
    let filtered = [...this.products];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(p => p.status === params.status);
    }

    const total = filtered.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total };
  }

  async getProductById(id: string): Promise<AdminProduct | null> {
    await this.delay(100);
    return this.products.find(p => p.id === id) || null;
  }

  async saveProduct(product: Partial<AdminProduct> & { id?: string }): Promise<AdminProduct> {
    await this.delay(200);
    if (product.id) {
      const idx = this.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        this.products[idx] = {
          ...this.products[idx],
          ...product,
          updatedAt: new Date().toISOString()
        } as AdminProduct;
        this.saveToStorage('selbar_admin_products', this.products);
        this.logActivity('Admin User', 'Super Admin', 'Product Updated', 'Products', `Updated product: ${this.products[idx].name}`);
        return this.products[idx];
      }
    }

    const newProd: AdminProduct = {
      id: `prod-${Date.now().toString(36)}`,
      name: product.name || 'Untitled Product',
      slug: product.slug || (product.name?.toLowerCase().replace(/\s+/g, '-') || 'product'),
      sku: product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: product.brand || 'SELBAR',
      category: product.category || 'General',
      subcategory: product.subcategory || '',
      description: product.description || '',
      price: product.price || 0,
      compareAtPrice: product.compareAtPrice || 0,
      costPrice: product.costPrice || 0,
      taxRate: product.taxRate || 18,
      taxClass: product.taxClass || 'Standard GST (18%)',
      stock: product.stock ?? 10,
      lowStockThreshold: product.lowStockThreshold ?? 5,
      stockStatus: (product.stock ?? 10) > 5 ? 'in_stock' : (product.stock ?? 10) > 0 ? 'low_stock' : 'out_of_stock',
      trackInventory: product.trackInventory ?? true,
      allowBackorders: product.allowBackorders ?? false,
      images: product.images?.length ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      variants: product.variants || [],
      weightKg: product.weightKg || 0.5,
      dimensionsCm: product.dimensionsCm || { length: 20, width: 15, height: 5 },
      shippingClass: product.shippingClass || 'Standard Fragile',
      tags: product.tags || [],
      status: product.status || 'published',
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      seoTitle: product.seoTitle || product.name,
      seoDescription: product.seoDescription || product.description?.slice(0, 150),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.unshift(newProd);
    this.saveToStorage('selbar_admin_products', this.products);
    this.logActivity('Admin User', 'Super Admin', 'Product Created', 'Products', `Created new product: ${newProd.name}`);
    return newProd;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.delay(150);
    const prod = this.products.find(p => p.id === id);
    this.products = this.products.filter(p => p.id !== id);
    this.saveToStorage('selbar_admin_products', this.products);
    if (prod) {
      this.logActivity('Admin User', 'Super Admin', 'Product Deleted', 'Products', `Deleted product: ${prod.name}`);
    }
    return true;
  }

  async bulkDeleteProducts(ids: string[]): Promise<number> {
    await this.delay(200);
    const initialCount = this.products.length;
    this.products = this.products.filter(p => !ids.includes(p.id));
    this.saveToStorage('selbar_admin_products', this.products);
    this.logActivity('Admin User', 'Super Admin', 'Bulk Delete', 'Products', `Deleted ${ids.length} products`);
    return initialCount - this.products.length;
  }

  async bulkUpdateProductStatus(ids: string[], status: ProductStatus): Promise<number> {
    await this.delay(150);
    let count = 0;
    this.products = this.products.map(p => {
      if (ids.includes(p.id)) {
        count++;
        return { ...p, status, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    this.saveToStorage('selbar_admin_products', this.products);
    return count;
  }

  // Orders API
  async getOrders(params?: {
    search?: string;
    status?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: AdminOrder[]; total: number }> {
    await this.delay(120);
    let filtered = [...this.orders];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        o => o.orderNumber.toLowerCase().includes(q) ||
             o.customerName.toLowerCase().includes(q) ||
             o.customerEmail.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(o => o.status.toLowerCase() === params.status!.toLowerCase());
    }

    if (params?.paymentMethod && params.paymentMethod !== 'all') {
      filtered = filtered.filter(o => o.paymentMethod === params.paymentMethod);
    }

    const total = filtered.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total };
  }

  async getOrderById(idOrNumber: string): Promise<AdminOrder | null> {
    await this.delay(100);
    return this.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber) || null;
  }

  async updateOrderStatus(id: string, newStatus: OrderStatus, notes?: string): Promise<AdminOrder | null> {
    await this.delay(150);
    const order = this.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    order.timeline.unshift({
      id: `t-${Date.now()}`,
      title: `Status Changed to ${newStatus}`,
      description: notes || `Admin updated order status to ${newStatus}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      completed: true,
      status: newStatus
    });

    this.saveToStorage('selbar_admin_orders', this.orders);
    this.logActivity('Admin User', 'Order Manager', 'Order Status Update', 'Orders', `Updated ${order.orderNumber} to ${newStatus}`);
    return { ...order };
  }

  // Customers API
  async getCustomers(params?: {
    search?: string;
    group?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: CustomerProfile[]; total: number }> {
    await this.delay(120);
    let filtered = [...this.customers];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    if (params?.group && params.group !== 'all') {
      filtered = filtered.filter(c => c.group.toLowerCase() === params.group!.toLowerCase());
    }

    const total = filtered.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total };
  }

  async getCustomerById(id: string): Promise<CustomerProfile | null> {
    await this.delay(100);
    return this.customers.find(c => c.id === id) || null;
  }

  // Inventory API
  async getInventory(params?: { search?: string; status?: string }): Promise<InventoryItem[]> {
    await this.delay(100);
    let items = [...this.inventory];
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    if (params?.status && params.status !== 'all') {
      items = items.filter(i => i.status === params.status);
    }
    return items;
  }

  async adjustStock(sku: string, delta: number, reason: string): Promise<InventoryItem | null> {
    await this.delay(150);
    const item = this.inventory.find(i => i.sku === sku);
    if (!item) return null;

    item.stock = Math.max(0, item.stock + delta);
    item.available = Math.max(0, item.stock - item.reserved);
    item.status = item.stock === 0 ? 'out_of_stock' : item.stock <= item.reorderLevel ? 'low_stock' : 'in_stock';
    item.totalValue = item.stock * item.unitCost;
    item.lastRestocked = new Date().toISOString().split('T')[0];

    // also update matching product
    const prod = this.products.find(p => p.sku === sku);
    if (prod) {
      prod.stock = item.stock;
      prod.stockStatus = item.status;
    }

    this.logActivity('Admin User', 'Super Admin', 'Stock Adjusted', 'Inventory', `Adjusted SKU ${sku} by ${delta > 0 ? '+' : ''}${delta} (${reason})`);
    return { ...item };
  }

  // Coupons API
  async getCoupons(): Promise<CouponItem[]> {
    await this.delay(100);
    return [...this.coupons];
  }

  async saveCoupon(coupon: Partial<CouponItem>): Promise<CouponItem> {
    await this.delay(150);
    const newCoupon: CouponItem = {
      id: coupon.id || `cpn-${Date.now().toString(36)}`,
      code: (coupon.code || 'COUPON').toUpperCase(),
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 10,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount,
      usageCount: coupon.usageCount || 0,
      usageLimit: coupon.usageLimit || 100,
      perCustomerLimit: coupon.perCustomerLimit || 1,
      startDate: coupon.startDate || new Date().toISOString().split('T')[0],
      endDate: coupon.endDate || '2026-12-31',
      applicableCategory: coupon.applicableCategory,
      status: coupon.status || 'active'
    };

    const existingIdx = this.coupons.findIndex(c => c.id === newCoupon.id);
    if (existingIdx !== -1) {
      this.coupons[existingIdx] = newCoupon;
    } else {
      this.coupons.unshift(newCoupon);
    }
    this.saveToStorage('selbar_admin_coupons', this.coupons);
    this.logActivity('Admin User', 'Marketing Manager', 'Coupon Saved', 'Marketing', `Saved coupon: ${newCoupon.code}`);
    return newCoupon;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    await this.delay(100);
    this.coupons = this.coupons.filter(c => c.id !== id);
    this.saveToStorage('selbar_admin_coupons', this.coupons);
    return true;
  }

  // Reviews API
  async getReviews(): Promise<ReviewItem[]> {
    await this.delay(100);
    return [...this.reviews];
  }

  async moderateReview(id: string, status: 'approved' | 'rejected' | 'reported'): Promise<boolean> {
    await this.delay(100);
    const rev = this.reviews.find(r => r.id === id);
    if (!rev) return false;
    rev.status = status;
    this.logActivity('Admin User', 'Manager', 'Review Moderated', 'Reviews', `Marked review for ${rev.productName} as ${status}`);
    return true;
  }

  // Campaigns API
  async getCampaigns(): Promise<MarketingCampaign[]> {
    await this.delay(100);
    return [...this.campaigns];
  }

  // Support Tickets API
  async getSupportTickets(): Promise<SupportTicket[]> {
    await this.delay(100);
    return [...this.supportTickets];
  }

  // Activity Logs API
  async getActivityLogs(): Promise<ActivityLogItem[]> {
    await this.delay(80);
    return [...this.activityLogs];
  }

  // Admin Users API
  async getAdminUsers(): Promise<AdminUser[]> {
    await this.delay(80);
    return [...this.adminUsers];
  }

  // Helper for logging
  private logActivity(adminName: string, adminRole: any, action: string, module: string, description: string) {
    this.activityLogs.unshift({
      id: `log-${Date.now()}`,
      adminName,
      adminRole,
      action,
      module,
      description,
      ipAddress: '103.21.124.89 (Mumbai, IN)',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const adminService = new AdminServiceStore();

// Client side export utility
export function exportDataToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            if (typeof cell === 'object') cell = JSON.stringify(cell);
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
