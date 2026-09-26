'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  XCircle,
  FileText,
  DollarSign,
  User,
  MapPin,
  Calendar,
  Phone,
  MessageSquare,
  ShieldCheck,
  Download,
  Check,
  X,
  ChevronRight,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { useAdmin } from '@/context/AdminContext';

export interface BuybackQuote {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  device: {
    category: string;
    brand: string;
    model: string;
    variant: string;
    imei?: string;
  };
  quotedPrice: number;
  finalPrice?: number;
  conditionSummary: {
    screen: string;
    body: string;
    functional: string;
    accessories: string[];
  };
  pickupAddress: {
    line: string;
    city: string;
    state: string;
    pincode: string;
  };
  pickupSlot: {
    date: string;
    timeWindow: string;
  };
  assignedExecutive?: {
    id: string;
    name: string;
    phone: string;
  };
  status: 'PENDING_PICKUP' | 'EXECUTIVE_ASSIGNED' | 'INSPECTED' | 'RENEGOTIATED' | 'PAID' | 'CANCELLED';
  payoutStatus: 'PENDING' | 'INITIATED' | 'COMPLETED' | 'FAILED';
  payoutMethod?: 'UPI' | 'IMPS' | 'BANK_TRANSFER';
  payoutUtr?: string;
  riskScore: number; // 0 - 100
  createdAt: string;
}

const INITIAL_QUOTES: BuybackQuote[] = [
  {
    id: 'bq-001',
    quoteNumber: 'SEL-BB-89210',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rahul.verma@example.com',
    device: {
      category: 'Mobile Phone',
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      variant: '128GB Deep Purple',
      imei: '358921098452109'
    },
    quotedPrice: 52000,
    finalPrice: 49500,
    conditionSummary: {
      screen: 'Flawless (No scratches)',
      body: 'Minor corner scuff',
      functional: 'FaceID, Battery (89%), TrueTone OK',
      accessories: ['Original Box', 'Original Cable', 'Bill / Invoice']
    },
    pickupAddress: {
      line: 'Flat 302, Royal Residency, Station Road',
      city: 'Bettiah',
      state: 'Bihar',
      pincode: '845438'
    },
    pickupSlot: {
      date: '2026-09-27',
      timeWindow: '10:00 AM - 12:00 PM'
    },
    assignedExecutive: {
      id: 'exec-1',
      name: 'Ramesh Singh',
      phone: '+91 91234 56789'
    },
    status: 'INSPECTED',
    payoutStatus: 'INITIATED',
    payoutMethod: 'UPI',
    payoutUtr: 'UPI-20260926-894102',
    riskScore: 8,
    createdAt: '2026-09-26T09:15:00Z'
  },
  {
    id: 'bq-002',
    quoteNumber: 'SEL-BB-89211',
    customerName: 'Amitabh Kumar',
    customerPhone: '+91 98111 22334',
    customerEmail: 'amitabh.k@example.com',
    device: {
      category: 'Mobile Phone',
      brand: 'Samsung',
      model: 'Galaxy S23 Ultra',
      variant: '256GB Phantom Black',
      imei: '357120091823901'
    },
    quotedPrice: 58000,
    finalPrice: 58000,
    conditionSummary: {
      screen: 'Flawless',
      body: 'Like New (Zero dents)',
      functional: 'All 17 tests passed',
      accessories: ['Original Box', 'S-Pen', 'Bill / Invoice']
    },
    pickupAddress: {
      line: 'House 14, Main Bazaar, Gandhi Chowk',
      city: 'Bagaha',
      state: 'Bihar',
      pincode: '845105'
    },
    pickupSlot: {
      date: '2026-09-27',
      timeWindow: '02:00 PM - 04:00 PM'
    },
    assignedExecutive: {
      id: 'exec-2',
      name: 'Vikram Patel',
      phone: '+91 91234 56790'
    },
    status: 'EXECUTIVE_ASSIGNED',
    payoutStatus: 'PENDING',
    payoutMethod: 'IMPS',
    riskScore: 12,
    createdAt: '2026-09-26T10:30:00Z'
  },
  {
    id: 'bq-003',
    quoteNumber: 'SEL-BB-89212',
    customerName: 'Priya Mishra',
    customerPhone: '+91 97722 33445',
    customerEmail: 'priya.m@example.com',
    device: {
      category: 'Mobile Phone',
      brand: 'OnePlus',
      model: 'OnePlus 11 5G',
      variant: '16GB / 256GB Titan Black',
      imei: '862019041284910'
    },
    quotedPrice: 31000,
    conditionSummary: {
      screen: 'Minor micro-scratches',
      body: 'No dents',
      functional: 'Camera, Warp Charge OK',
      accessories: ['100W Charger', 'Original Box']
    },
    pickupAddress: {
      line: 'Plot 45, Kankarbagh Main Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800020'
    },
    pickupSlot: {
      date: '2026-09-28',
      timeWindow: '12:00 PM - 02:00 PM'
    },
    status: 'PENDING_PICKUP',
    payoutStatus: 'PENDING',
    payoutMethod: 'UPI',
    riskScore: 5,
    createdAt: '2026-09-26T11:45:00Z'
  },
  {
    id: 'bq-004',
    quoteNumber: 'SEL-BB-89213',
    customerName: 'Sanjay Gupta',
    customerPhone: '+91 94500 11223',
    customerEmail: 'sanjay.gupta@example.com',
    device: {
      category: 'Mobile Phone',
      brand: 'Apple',
      model: 'iPhone 13',
      variant: '128GB Starlight',
      imei: '354890019283741'
    },
    quotedPrice: 34000,
    finalPrice: 28500,
    conditionSummary: {
      screen: 'Cracked outer glass, display working',
      body: 'Corner dent near camera ring',
      functional: 'Battery health 78% (Service recommended)',
      accessories: ['Box Only']
    },
    pickupAddress: {
      line: 'Shop 4, Golghar Market',
      city: 'Gorakhpur',
      state: 'Uttar Pradesh',
      pincode: '273001'
    },
    pickupSlot: {
      date: '2026-09-26',
      timeWindow: '04:00 PM - 06:00 PM'
    },
    assignedExecutive: {
      id: 'exec-3',
      name: 'Mohd. Imran',
      phone: '+91 91234 56791'
    },
    status: 'PAID',
    payoutStatus: 'COMPLETED',
    payoutMethod: 'UPI',
    payoutUtr: 'UPI-20260926-992104',
    riskScore: 22,
    createdAt: '2026-09-25T14:20:00Z'
  },
  {
    id: 'bq-005',
    quoteNumber: 'SEL-BB-89214',
    customerName: 'Kunal Shrestha',
    customerPhone: '+91 98000 99887',
    customerEmail: 'kunal.s@example.com',
    device: {
      category: 'Mobile Phone',
      brand: 'Google',
      model: 'Pixel 7',
      variant: '128GB Obsidian',
      imei: '359128001928374'
    },
    quotedPrice: 24500,
    conditionSummary: {
      screen: 'Flawless',
      body: 'Minor pocket wear',
      functional: 'Cameras & Tensor Chip 100%',
      accessories: ['Box and Cable']
    },
    pickupAddress: {
      line: 'Tower B, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309'
    },
    pickupSlot: {
      date: '2026-09-27',
      timeWindow: '10:00 AM - 12:00 PM'
    },
    status: 'PENDING_PICKUP',
    payoutStatus: 'PENDING',
    payoutMethod: 'BANK_TRANSFER',
    riskScore: 78, // High risk flagged
    createdAt: '2026-09-26T12:05:00Z'
  }
];

export default function AdminBuybackQuotesPage() {
  const { addToast } = useAdmin();
  const [quotes, setQuotes] = useState<BuybackQuote[]>(INITIAL_QUOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [selectedQuote, setSelectedQuote] = useState<BuybackQuote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [payoutInputUtr, setPayoutInputUtr] = useState('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  // Field executives list for assignment
  const FIELD_EXECUTIVES = [
    { id: 'exec-1', name: 'Ramesh Singh', phone: '+91 91234 56789', hub: 'Bettiah' },
    { id: 'exec-2', name: 'Vikram Patel', phone: '+91 91234 56790', hub: 'Bagaha' },
    { id: 'exec-3', name: 'Mohd. Imran', phone: '+91 91234 56791', hub: 'Gorakhpur' },
    { id: 'exec-4', name: 'Alok Sharma', phone: '+91 91234 56792', hub: 'Patna' }
  ];

  // Filtering
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerPhone.includes(searchQuery) ||
      quote.device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quote.device.imei && quote.device.imei.includes(searchQuery));

    const matchesStatus = statusFilter === 'ALL' || quote.status === statusFilter;
    const matchesCity = cityFilter === 'ALL' || quote.pickupAddress.city.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  const getStatusBadge = (status: BuybackQuote['status']) => {
    switch (status) {
      case 'PENDING_PICKUP':
        return <Badge variant="warning">Pending Pickup</Badge>;
      case 'EXECUTIVE_ASSIGNED':
        return <Badge variant="info">Executive Assigned</Badge>;
      case 'INSPECTED':
        return <Badge variant="info">Inspected</Badge>;
      case 'RENEGOTIATED':
        return <Badge variant="warning">Price Renegotiated</Badge>;
      case 'PAID':
        return <Badge variant="success">Completed & Paid</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleAssignExecutive = (quoteId: string, execId: string) => {
    const exec = FIELD_EXECUTIVES.find(e => e.id === execId);
    if (!exec) return;

    setQuotes(prev =>
      prev.map(q => {
        if (q.id === quoteId) {
          return {
            ...q,
            assignedExecutive: { id: exec.id, name: exec.name, phone: exec.phone },
            status: q.status === 'PENDING_PICKUP' ? 'EXECUTIVE_ASSIGNED' : q.status
          };
        }
        return q;
      })
    );

    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote(prev =>
        prev
          ? {
              ...prev,
              assignedExecutive: { id: exec.id, name: exec.name, phone: exec.phone },
              status: prev.status === 'PENDING_PICKUP' ? 'EXECUTIVE_ASSIGNED' : prev.status
            }
          : null
      );
    }

    addToast({
      title: 'Field Executive Assigned',
      message: `${exec.name} has been dispatched for pickup.`,
      type: 'success'
    });
  };

  const handleDisbursePayout = (quoteId: string) => {
    setIsProcessingPayout(true);
    setTimeout(() => {
      const generatedUtr = payoutInputUtr || `UPI-${new Date().getFullYear()}0926-${Math.floor(100000 + Math.random() * 900000)}`;

      setQuotes(prev =>
        prev.map(q => {
          if (q.id === quoteId) {
            return {
              ...q,
              status: 'PAID',
              payoutStatus: 'COMPLETED',
              payoutUtr: generatedUtr,
              finalPrice: q.finalPrice || q.quotedPrice
            };
          }
          return q;
        })
      );

      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote(prev =>
          prev
            ? {
                ...prev,
                status: 'PAID',
                payoutStatus: 'COMPLETED',
                payoutUtr: generatedUtr,
                finalPrice: prev.finalPrice || prev.quotedPrice
              }
            : null
        );
      }

      setIsProcessingPayout(false);
      setPayoutInputUtr('');
      addToast({
        title: 'Payout Disbursed Successfully',
        message: `Amount ₹${(selectedQuote?.finalPrice || selectedQuote?.quotedPrice || 0).toLocaleString('en-IN')} transferred via UPI (UTR: ${generatedUtr})`,
        type: 'success'
      });
    }, 1000);
  };

  // Metrics
  const totalValuationDisbursed = quotes
    .filter(q => q.status === 'PAID')
    .reduce((sum, q) => sum + (q.finalPrice || q.quotedPrice), 0);
  const pendingCount = quotes.filter(q => q.status === 'PENDING_PICKUP' || q.status === 'EXECUTIVE_ASSIGNED').length;
  const inspectedCount = quotes.filter(q => q.status === 'INSPECTED' || q.status === 'RENEGOTIATED').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Device Buyback & Sell Quotes</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              PRD Sec 11-17
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Monitor customer doorstep sell requests, review 17-point inspection reports, and authorize instant payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => addToast({ title: 'Synced', message: 'Sell quotes reloaded from database.', type: 'info' })}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Sync Quotes
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Buyback Requests</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{quotes.length}</div>
          <p className="mt-1 text-xs text-slate-500">Active quotes generated by users</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Pending Pickups</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{pendingCount}</div>
          <p className="mt-1 text-xs text-slate-500">Doorstep slots scheduled</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Inspections Completed</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{inspectedCount}</div>
          <p className="mt-1 text-xs text-slate-500">Awaiting customer final payout approval</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Payout Disbursed</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600">₹{totalValuationDisbursed.toLocaleString('en-IN')}</div>
          <p className="mt-1 text-xs text-slate-500">Transferred via Instant UPI / IMPS</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Quote ID (SEL-BB-...), Customer Name, Phone, IMEI, Device Model..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_PICKUP">Pending Pickup</option>
              <option value="EXECUTIVE_ASSIGNED">Executive Assigned</option>
              <option value="INSPECTED">Inspected</option>
              <option value="RENEGOTIATED">Renegotiated</option>
              <option value="PAID">Completed & Paid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">All Hubs & Cities</option>
              <option value="Bettiah">Bettiah Hub</option>
              <option value="Bagaha">Bagaha Hub</option>
              <option value="Patna">Patna Hub</option>
              <option value="Gorakhpur">Gorakhpur Hub</option>
              <option value="Noida">Noida Hub</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Quote ID & Date</th>
                <th className="px-4 py-3">Customer Info</th>
                <th className="px-4 py-3">Device & Specs</th>
                <th className="px-4 py-3">Slot & Hub</th>
                <th className="px-4 py-3">Assessed Value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No buyback quotes matching your filters.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{quote.quoteNumber}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(quote.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{quote.customerName}</div>
                      <div className="text-xs text-slate-500">{quote.customerPhone}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{quote.device.brand} {quote.device.model}</div>
                      <div className="text-xs text-slate-500">{quote.device.variant}</div>
                      {quote.device.imei && (
                        <div className="font-mono text-[10px] text-slate-400">IMEI: {quote.device.imei}</div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{quote.pickupAddress.city}</div>
                      <div className="text-xs text-slate-500">{quote.pickupSlot.date} ({quote.pickupSlot.timeWindow})</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-emerald-600">
                        ₹{(quote.finalPrice || quote.quotedPrice).toLocaleString('en-IN')}
                      </div>
                      {quote.finalPrice && quote.finalPrice !== quote.quotedPrice && (
                        <div className="text-[11px] text-slate-400 line-through">
                          ₹{quote.quotedPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {getStatusBadge(quote.status)}
                    </td>

                    <td className="px-4 py-3">
                      {quote.riskScore > 50 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          <AlertTriangle className="h-3 w-3" /> High ({quote.riskScore})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <Check className="h-3 w-3" /> Safe ({quote.riskScore})
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Details & Action Modal */}
      {selectedQuote && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Quote #${selectedQuote.quoteNumber} — ${selectedQuote.device.brand} ${selectedQuote.device.model}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-sm">
            {/* Top Status & Valuation Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div>
                <div className="text-xs uppercase text-slate-500 font-semibold">Quote Status</div>
                <div className="mt-1">{getStatusBadge(selectedQuote.status)}</div>
              </div>

              <div>
                <div className="text-xs uppercase text-slate-500 font-semibold">Initial Quoted Value</div>
                <div className="text-lg font-bold text-slate-900">₹{selectedQuote.quotedPrice.toLocaleString('en-IN')}</div>
              </div>

              <div>
                <div className="text-xs uppercase text-slate-500 font-semibold">Final Agreed Value</div>
                <div className="text-xl font-extrabold text-emerald-600">
                  ₹{(selectedQuote.finalPrice || selectedQuote.quotedPrice).toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase text-slate-500 font-semibold">Payout Status</div>
                <div className="mt-1">
                  <Badge variant={selectedQuote.payoutStatus === 'COMPLETED' ? 'success' : 'warning'}>
                    {selectedQuote.payoutStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-emerald-600" /> Customer Information
                </h4>
                <div className="mt-3 space-y-1.5 text-slate-600">
                  <p><span className="font-medium text-slate-800">Name:</span> {selectedQuote.customerName}</p>
                  <p><span className="font-medium text-slate-800">Phone:</span> {selectedQuote.customerPhone}</p>
                  <p><span className="font-medium text-slate-800">Email:</span> {selectedQuote.customerEmail}</p>
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${selectedQuote.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedQuote.customerPhone}`}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" /> Pickup Slot & Address
                </h4>
                <div className="mt-3 space-y-1.5 text-slate-600">
                  <p><span className="font-medium text-slate-800">Address:</span> {selectedQuote.pickupAddress.line}</p>
                  <p><span className="font-medium text-slate-800">City & Pincode:</span> {selectedQuote.pickupAddress.city}, {selectedQuote.pickupAddress.pincode} ({selectedQuote.pickupAddress.state})</p>
                  <p><span className="font-medium text-slate-800">Slot:</span> {selectedQuote.pickupSlot.date} | {selectedQuote.pickupSlot.timeWindow}</p>
                </div>
              </div>
            </div>

            {/* Condition Diagnostics Summary */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Customer Self-Assessment Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="rounded bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Screen:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedQuote.conditionSummary.screen}</p>
                </div>
                <div className="rounded bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Body / Frame:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedQuote.conditionSummary.body}</p>
                </div>
                <div className="rounded bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Functional Tests:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedQuote.conditionSummary.functional}</p>
                </div>
                <div className="rounded bg-slate-50 p-2.5">
                  <span className="text-slate-500 font-medium">Included Accessories:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedQuote.conditionSummary.accessories.join(', ') || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Field Executive Dispatch Control */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-emerald-600" /> Assigned Field Executive
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedQuote.assignedExecutive
                      ? `Currently assigned to ${selectedQuote.assignedExecutive.name} (${selectedQuote.assignedExecutive.phone})`
                      : 'No technician assigned yet. Select an executive to dispatch.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
                    onChange={e => handleAssignExecutive(selectedQuote.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Dispatch Executive...</option>
                    {FIELD_EXECUTIVES.map(exec => (
                      <option key={exec.id} value={exec.id}>
                        {exec.name} ({exec.hub} Hub)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Instant Payout Release Section */}
            <div className="rounded-xl border-2 border-emerald-500/20 bg-emerald-50/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Doorstep Customer Payout
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {selectedQuote.payoutStatus === 'COMPLETED' ? (
                      <span className="text-emerald-700 font-medium">
                        Payout verified & completed via {selectedQuote.payoutMethod} (UTR: {selectedQuote.payoutUtr})
                      </span>
                    ) : (
                      'Once executive completes 17-point physical inspection, disburse funds directly via UPI / IMPS gateway.'
                    )}
                  </p>
                </div>

                {selectedQuote.payoutStatus !== 'COMPLETED' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Bank UTR (Optional)"
                      value={payoutInputUtr}
                      onChange={e => setPayoutInputUtr(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isProcessingPayout}
                      onClick={() => handleDisbursePayout(selectedQuote.id)}
                    >
                      {isProcessingPayout ? 'Processing...' : 'Disburse Payout'}
                    </Button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-xs text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" /> Disbursed
                  </span>
                )}
              </div>
            </div>

            {/* NIST Certificate & Compliance actions */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Compliance:</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck className="h-3.5 w-3.5" /> NIST SP 800-88 Ready
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToast({ title: 'Certificate Downloaded', message: `NIST 800-88 certificate for ${selectedQuote.device.model} generated.`, type: 'info' })}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Data Wipe Cert
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
