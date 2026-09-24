'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  CreditCard,
  Bell,
  Search,
  ChevronDown,
  SlidersHorizontal,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Store,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Filter & Sort Components
import { FilterSidebar, FilterState } from '@/components/seller/filters/FilterSidebar';
import { MobileFilterDrawer } from '@/components/seller/filters/MobileFilterDrawer';
import { ActiveFilterChips, ActiveFilterItem } from '@/components/seller/filters/ActiveFilterChips';
import { SegmentedSortBar, SortKey } from '@/components/seller/filters/SegmentedSortBar';
import { FacetOption } from '@/components/seller/filters/SearchableFacetList';

// Order Components
import { OrderCard, SellerOrderData } from '@/components/seller/orders/OrderCard';
import { OrderStatusType } from '@/components/seller/orders/OrderStatusBadge';

// Account & Auth Components
import { WarehouseAddressCard, WarehouseAddress } from '@/components/seller/account/WarehouseAddressCard';
import { BankAccountCard, BankAccountDetails } from '@/components/seller/account/BankAccountCard';
import { SellerOnboardingWizard } from '@/components/seller/auth/SellerOnboardingWizard';

// --- MOCK INITIAL DATA ---
const CATEGORY_OPTIONS: FacetOption[] = [
  { id: 'smartphones', label: 'Smartphones & Mobiles', count: 184 },
  { id: 'refurbished', label: 'Refurbished Certified', count: 126 },
  { id: 'laptops', label: 'Laptops & Tablets', count: 42 },
  { id: 'accessories', label: 'Chargers & Cables', count: 35 },
  { id: 'smartwatches', label: 'Smartwatches', count: 18 }
];

const BRAND_OPTIONS: FacetOption[] = [
  { id: 'apple', label: 'Apple iPhone', count: 74 },
  { id: 'samsung', label: 'Samsung Galaxy', count: 68 },
  { id: 'oneplus', label: 'OnePlus', count: 38 },
  { id: 'xiaomi', label: 'Xiaomi / Redmi', count: 29 },
  { id: 'realme', label: 'Realme', count: 21 },
  { id: 'vivo', label: 'Vivo', count: 17 },
  { id: 'oppo', label: 'Oppo', count: 12 },
  { id: 'motorola', label: 'Motorola', count: 9 }
];

const STATUS_OPTIONS: FacetOption[] = [
  { id: 'PENDING', label: 'Pending Verification', count: 14 },
  { id: 'QC_PASSED', label: 'QC Passed', count: 8 },
  { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup', count: 12 },
  { id: 'IN_TRANSIT', label: 'In Transit', count: 19 },
  { id: 'DELIVERED', label: 'Delivered & Paid', count: 95 }
];

const FULFILLMENT_OPTIONS: FacetOption[] = [
  { id: 'selbar_doorstep', label: 'SELBAR Doorstep Pickup', count: 132 },
  { id: 'hub_dropoff', label: 'Partner Hub Drop-off', count: 46 }
];

const INITIAL_ORDERS: SellerOrderData[] = [
  {
    id: 'SLB-88129',
    placedAt: 'Today, 10:45 AM',
    paymentMode: 'PREPAID - UPI',
    totalAmount: 34500,
    status: 'READY_FOR_PICKUP',
    urgency: 'URGENT',
    slaDeadline: 'Today by 4:00 PM',
    customerCity: 'Patna',
    customerPincode: '800001',
    items: [
      {
        title: 'Apple iPhone 13 (128GB - Midnight Blue)',
        variant: '128GB Storage • 4GB RAM',
        grade: 'Grade A (Flawless)',
        sku: 'IPH13-128-MID',
        imei: '358291048291024',
        price: 34500
      }
    ]
  },
  {
    id: 'SLB-88128',
    placedAt: 'Today, 09:12 AM',
    paymentMode: 'COD',
    totalAmount: 18200,
    status: 'QC_PASSED',
    urgency: 'NORMAL',
    slaDeadline: 'Tomorrow by 12:00 PM',
    customerCity: 'Muzaffarpur',
    customerPincode: '842001',
    items: [
      {
        title: 'OnePlus Nord CE 3 5G (8GB/128GB - Aqua Surge)',
        variant: '128GB Storage • 8GB RAM',
        grade: 'Grade B (Good)',
        sku: 'OP-NORD-CE3-AQ',
        imei: '869281039102847',
        price: 18200
      }
    ]
  },
  {
    id: 'SLB-88127',
    placedAt: 'Yesterday, 06:30 PM',
    paymentMode: 'PREPAID - UPI',
    totalAmount: 22800,
    status: 'PENDING',
    urgency: 'NORMAL',
    slaDeadline: 'Tomorrow by 2:00 PM',
    customerCity: 'Gaya',
    customerPincode: '823001',
    items: [
      {
        title: 'Samsung Galaxy S21 FE 5G (Olive Green)',
        variant: '128GB Storage • 8GB RAM',
        grade: 'Grade A (Flawless)',
        sku: 'SAM-S21FE-OLV',
        imei: '359102847102941',
        price: 22800
      }
    ]
  },
  {
    id: 'SLB-88126',
    placedAt: '15 Sep, 02:15 PM',
    paymentMode: 'PREPAID - UPI',
    totalAmount: 58000,
    status: 'IN_TRANSIT',
    urgency: 'NORMAL',
    customerCity: 'Patna',
    customerPincode: '800020',
    items: [
      {
        title: 'Apple iPhone 14 Pro (256GB - Deep Purple)',
        variant: '256GB Storage • 6GB RAM',
        grade: 'Grade A (Flawless)',
        sku: 'IPH14P-256-PUR',
        imei: '351928471920384',
        price: 58000
      }
    ]
  },
  {
    id: 'SLB-88125',
    placedAt: '14 Sep, 11:00 AM',
    paymentMode: 'PREPAID - UPI',
    totalAmount: 12500,
    status: 'DELIVERED',
    urgency: 'NORMAL',
    customerCity: 'Bhagalpur',
    customerPincode: '812001',
    items: [
      {
        title: 'Redmi Note 12 Pro 5G (Glacier Blue)',
        variant: '128GB Storage • 6GB RAM',
        grade: 'Grade B (Good)',
        sku: 'RED-N12P-BLU',
        imei: '861928401928374',
        price: 12500
      }
    ]
  }
];

const INITIAL_WAREHOUSES: WarehouseAddress[] = [
  {
    id: 'wh-1',
    hubName: 'Patna Main Logistics & QC Hub',
    contactPerson: 'Ramesh Kumar (Store Manager)',
    phone: '9876543210',
    addressLine: 'Shop #14, Ground Floor, Boring Road Commercial Complex',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    isDefault: true
  },
  {
    id: 'wh-2',
    hubName: 'Kankarbagh Retail Experience Centre',
    contactPerson: 'Amit Verma',
    phone: '9876543211',
    addressLine: 'Plot #88, Old Bypass Road, Kankarbagh',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800020',
    isDefault: false
  }
];

const INITIAL_BANK: BankAccountDetails = {
  bankName: 'HDFC Bank Limited',
  accountHolder: 'MAAJANKI ELECTRONICS & TELECOM PRIVATE LIMITED',
  maskedAccountNumber: '•••• •••• •••• 4821',
  ifsc: 'HDFC0001234',
  accountType: 'Current',
  isVerified: true,
  payoutSchedule: 'Daily T+1 settlements via IMPS/NEFT'
};

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'warehouses' | 'banking'>('orders');
  const [orders, setOrders] = useState<SellerOrderData[]>(INITIAL_ORDERS);
  const [warehouses, setWarehouses] = useState<WarehouseAddress[]>(INITIAL_WAREHOUSES);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortKey>('newest');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [5000, 70000],
    statuses: [],
    fulfillment: []
  });

  // Calculate active filters list for chips
  const activeChips = useMemo<ActiveFilterItem[]>(() => {
    const list: ActiveFilterItem[] = [];

    filters.categories.forEach((catId) => {
      const opt = CATEGORY_OPTIONS.find((c) => c.id === catId);
      if (opt) list.push({ id: catId, categoryKey: 'categories', label: opt.label });
    });

    filters.brands.forEach((brandId) => {
      const opt = BRAND_OPTIONS.find((b) => b.id === brandId);
      if (opt) list.push({ id: brandId, categoryKey: 'brands', label: opt.label });
    });

    filters.statuses.forEach((st) => {
      const opt = STATUS_OPTIONS.find((s) => s.id === st);
      if (opt) list.push({ id: st, categoryKey: 'statuses', label: opt.label });
    });

    filters.fulfillment.forEach((fId) => {
      const opt = FULFILLMENT_OPTIONS.find((f) => f.id === fId);
      if (opt) list.push({ id: fId, categoryKey: 'fulfillment', label: opt.label });
    });

    if (filters.priceRange[0] !== 5000 || filters.priceRange[1] !== 70000) {
      list.push({
        id: 'price-range',
        categoryKey: 'priceRange',
        label: `₹${filters.priceRange[0].toLocaleString()} - ₹${filters.priceRange[1].toLocaleString()}`
      });
    }

    return list;
  }, [filters]);

  const handleRemoveChip = (id: string, categoryKey: string) => {
    if (categoryKey === 'priceRange') {
      setFilters((prev) => ({ ...prev, priceRange: [5000, 70000] }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [categoryKey]: (prev as any)[categoryKey].filter((item: string) => item !== id)
      }));
    }
  };

  const handleClearAllChips = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [5000, 70000],
      statuses: [],
      fulfillment: []
    });
  };

  // Filter and Sort Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(ord.status)) {
        return false;
      }
      // Price Range
      if (ord.totalAmount < filters.priceRange[0] || ord.totalAmount > filters.priceRange[1]) {
        return false;
      }
      // Brand filter
      if (filters.brands.length > 0) {
        const hasMatchingBrand = ord.items.some((item) =>
          filters.brands.some((b) => item.title.toLowerCase().includes(b.toLowerCase()))
        );
        if (!hasMatchingBrand) return false;
      }
      return true;
    }).sort((a, b) => {
      if (currentSort === 'urgent') {
        if (a.urgency === 'URGENT' && b.urgency !== 'URGENT') return -1;
        if (b.urgency === 'URGENT' && a.urgency !== 'URGENT') return 1;
      }
      if (currentSort === 'value_high') return b.totalAmount - a.totalAmount;
      if (currentSort === 'value_low') return a.totalAmount - b.totalAmount;
      return 0; // Default order
    });
  }, [orders, filters, currentSort]);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatusType) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  const handleSetDefaultWarehouse = (whId: string) => {
    setWarehouses((prev) =>
      prev.map((wh) => ({ ...wh, isDefault: wh.id === whId }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Store Selector */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base shadow-sm">
                S
              </span>
              <span className="font-black text-lg tracking-tight text-white hidden sm:inline">
                SELBAR <span className="text-orange-500 font-semibold text-xs ml-1 uppercase">Seller Central</span>
              </span>
            </Link>

            {/* Store Hub Switcher */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer hover:bg-slate-800">
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span>Patna Main Logistics Hub</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, IMEI, SKU, customer pincode... (⌘K)"
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-800"
              />
            </div>
          </div>

          {/* Right Action Icons & KYC Profile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verify KYC</span>
            </button>

            <button
              type="button"
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
            </button>

            {/* Seller Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                MK
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-slate-100">Maajanki Tech</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified Partner
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Today's Orders</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 pt-1">{orders.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
              <TrendingUp className="w-3 h-3" /> +18% vs yesterday
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Pending Dispatch</span>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 pt-1">
              {orders.filter((o) => o.status === 'READY_FOR_PICKUP' || o.status === 'PENDING').length}
            </div>
            <div className="text-[11px] text-orange-600 font-semibold pt-0.5">
              1 SLA Urgent pickup
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Available Payout</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 pt-1">₹1,46,000</div>
            <div className="text-[11px] text-slate-500 pt-0.5">Next settlement: Tomorrow 10 AM</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>SLA Compliance</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 pt-1">99.4%</div>
            <div className="text-[11px] text-emerald-600 font-semibold pt-0.5">Tier 1 Elite Seller</div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs">
          <nav className="flex space-x-6 overflow-x-auto text-xs font-semibold py-3 select-none">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders & Fulfillment ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('warehouses')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'warehouses'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Warehouse Hubs ({warehouses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('banking')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'banking'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payouts & Banking</span>
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Exporting orders as CSV...')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Orders & Fulfillment View */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Rail: Persistent Desktop Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-1 sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                categoryOptions={CATEGORY_OPTIONS}
                brandOptions={BRAND_OPTIONS}
                statusOptions={STATUS_OPTIONS}
                fulfillmentOptions={FULFILLMENT_OPTIONS}
                minPrice={5000}
                maxPrice={70000}
              />
            </div>

            {/* Right Panel: Orders Management Feed */}
            <div className="lg:col-span-3 space-y-3">
              {/* Sorting & Segmented Bar */}
              <SegmentedSortBar
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                totalCount={filteredOrders.length}
                onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                activeFilterCount={activeChips.length}
              />

              {/* Active Filter Chips Row */}
              <ActiveFilterChips
                filters={activeChips}
                onRemove={handleRemoveChip}
                onClearAll={handleClearAllChips}
              />

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">No orders match these filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your price range or resetting selected categories and status filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAllChips}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateOrderStatus}
                      onPrintLabel={(id) => alert(`Printing Shipping Label for order ${id}`)}
                      onDownloadInvoice={(id) => alert(`Downloading GST Tax Invoice for order ${id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Warehouse Hubs Management */}
        {activeTab === 'warehouses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Doorstep Pickup & Warehouse Hubs</h3>
                <p className="text-xs text-slate-500">
                  Manage locations where SELBAR delivery executives collect and verify inspected electronics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert('Add Warehouse modal opened')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Hub</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map((wh) => (
                <WarehouseAddressCard
                  key={wh.id}
                  address={wh}
                  onSetDefault={handleSetDefaultWarehouse}
                  onEdit={(id) => alert(`Edit warehouse ${id}`)}
                  onDelete={(id) => setWarehouses((prev) => prev.filter((w) => w.id !== id))}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Payouts & Banking */}
        {activeTab === 'banking' && (
          <div className="space-y-4 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">Bank Accounts & Settlement Settings</h3>
              <p className="text-xs text-slate-500">
                Verified commercial bank accounts for instant doorstep buyback payment disbursal.
              </p>
            </div>

            <BankAccountCard
              account={INITIAL_BANK}
              onChangeBank={() => setIsWizardOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Mobile Filter Bottom Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        categoryOptions={CATEGORY_OPTIONS}
        brandOptions={BRAND_OPTIONS}
        statusOptions={STATUS_OPTIONS}
        fulfillmentOptions={FULFILLMENT_OPTIONS}
        totalResultsCount={filteredOrders.length}
      />

      {/* 4-Step Onboarding & KYC Wizard Modal */}
      <SellerOnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={(profile) => {
          alert(`Seller KYC Verified for: ${profile.legalName}`);
        }}
      />
    </div>
  );
}
