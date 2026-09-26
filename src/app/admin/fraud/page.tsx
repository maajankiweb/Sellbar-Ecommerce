'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Lock,
  UserX,
  FileWarning,
  Eye,
  CheckCircle2,
  XCircle,
  Database,
  RefreshCw,
  ExternalLink,
  Ban,
  Check,
  Flag,
  Fingerprint,
  Activity,
  History,
  Smartphone
} from 'lucide-react';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { useAdmin } from '@/context/AdminContext';

interface FraudIncident {
  id: string;
  incidentId: string;
  quoteId: string;
  customerName: string;
  customerPhone: string;
  customerIp: string;
  device: {
    brand: string;
    model: string;
    imei: string;
    quotedValue: number;
    inspectedValue?: number;
  };
  riskScore: number; // 0 - 100
  riskCategory: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  flags: Array<{
    code: string;
    description: string;
    severity: 'critical' | 'high' | 'medium';
  }>;
  status: 'PENDING_REVIEW' | 'BLOCKED' | 'APPROVED' | 'REPORTED';
  createdAt: string;
}

interface BlacklistEntry {
  id: string;
  imei: string;
  brand: string;
  model: string;
  reason: 'STOLEN' | 'POLICE_FIR' | 'FINANCE_DEFAULT' | 'COUNTERFEIT';
  firNumber?: string;
  reportedBy: string;
  reportedAt: string;
}

const INITIAL_INCIDENTS: FraudIncident[] = [
  {
    id: 'inc-01',
    incidentId: 'FRD-2026-0041',
    quoteId: 'SEL-BB-89214',
    customerName: 'Kunal Shrestha',
    customerPhone: '+91 98000 99887',
    customerIp: '103.21.144.92 (Proxy / VPN)',
    device: {
      brand: 'Google',
      model: 'Pixel 7 128GB',
      imei: '359128001928374',
      quotedValue: 24500,
    },
    riskScore: 88,
    riskCategory: 'CRITICAL',
    flags: [
      { code: 'IP_GEO_PROXY', description: 'Request originated from known VPN/datacenter IP', severity: 'medium' },
      { code: 'DUPLICATE_IMEI', description: 'Same IMEI quoted by 3 different mobile numbers in 48h', severity: 'critical' },
      { code: 'VELOCITY_LIMIT', description: '4 sell requests submitted within 15 minutes', severity: 'high' }
    ],
    status: 'PENDING_REVIEW',
    createdAt: '2026-09-26T12:05:00Z'
  },
  {
    id: 'inc-02',
    incidentId: 'FRD-2026-0042',
    quoteId: 'SEL-BB-87102',
    customerName: 'Deepak Choudhary',
    customerPhone: '+91 99112 44331',
    customerIp: '49.36.128.4',
    device: {
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      imei: '354019283019284',
      quotedValue: 72000,
      inspectedValue: 25000,
    },
    riskScore: 74,
    riskCategory: 'HIGH',
    flags: [
      { code: 'EXTREME_DISPARITY', description: 'Physical inspection deduction is 65% (Cracked body & non-OEM parts)', severity: 'high' },
      { code: 'SUSPICIOUS_UPI', description: 'UPI handle changed 3 times during inspection phase', severity: 'high' }
    ],
    status: 'PENDING_REVIEW',
    createdAt: '2026-09-26T08:30:00Z'
  },
  {
    id: 'inc-03',
    incidentId: 'FRD-2026-0043',
    quoteId: 'SEL-BB-85910',
    customerName: 'Anonymous Seller',
    customerPhone: '+91 97120 00192',
    customerIp: '14.139.22.90',
    device: {
      brand: 'Samsung',
      model: 'Galaxy Z Fold 5',
      imei: '357199201928371',
      quotedValue: 64000,
    },
    riskScore: 95,
    riskCategory: 'CRITICAL',
    flags: [
      { code: 'CEIR_BLACKLIST_MATCH', description: 'IMEI matched in National Stolen Mobile Registry (CEIR/DoT)', severity: 'critical' },
      { code: 'POLICE_REPORT_LINKED', description: 'Reported lost/stolen under FIR #482/2026', severity: 'critical' }
    ],
    status: 'BLOCKED',
    createdAt: '2026-09-25T16:10:00Z'
  },
  {
    id: 'inc-04',
    incidentId: 'FRD-2026-0044',
    quoteId: 'SEL-BB-84192',
    customerName: 'Manish Pandey',
    customerPhone: '+91 94511 88291',
    customerIp: '27.56.91.12',
    device: {
      brand: 'OnePlus',
      model: 'OnePlus 12',
      imei: '861092837192019',
      quotedValue: 39000,
      inspectedValue: 37500,
    },
    riskScore: 42,
    riskCategory: 'MEDIUM',
    flags: [
      { code: 'NEW_ACCOUNT_HIGH_VALUE', description: 'High-value transaction on newly registered account', severity: 'medium' }
    ],
    status: 'APPROVED',
    createdAt: '2026-09-25T11:20:00Z'
  }
];

const INITIAL_BLACKLIST: BlacklistEntry[] = [
  {
    id: 'bl-1',
    imei: '357199201928371',
    brand: 'Samsung',
    model: 'Galaxy Z Fold 5',
    reason: 'POLICE_FIR',
    firNumber: 'FIR #482/2026 (Patna Central)',
    reportedBy: 'CEIR Registry Sync',
    reportedAt: '2026-09-25'
  },
  {
    id: 'bl-2',
    imei: '358910293847192',
    brand: 'Apple',
    model: 'iPhone 14',
    reason: 'FINANCE_DEFAULT',
    reportedBy: 'Bajaj Finance Fraud Desk',
    reportedAt: '2026-09-20'
  },
  {
    id: 'bl-3',
    imei: '860192837465019',
    brand: 'Vivo',
    model: 'X90 Pro',
    reason: 'COUNTERFEIT',
    reportedBy: 'Field Inspection QC (Bettiah Hub)',
    reportedAt: '2026-09-18'
  }
];

export default function AdminFraudRiskPage() {
  const { addToast } = useAdmin();
  const [incidents, setIncidents] = useState<FraudIncident[]>(INITIAL_INCIDENTS);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(INITIAL_BLACKLIST);
  const [activeTab, setActiveTab] = useState<'INCIDENTS' | 'BLACKLIST' | 'LOOKUP'>('INCIDENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<FraudIncident | null>(null);

  // IMEI Lookup tool state
  const [lookupImei, setLookupImei] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    checked: boolean;
    clean: boolean;
    details?: string;
    gsmaStatus?: string;
  } | null>(null);

  // Add Blacklist Modal
  const [isAddBlacklistOpen, setIsAddBlacklistOpen] = useState(false);
  const [newImei, setNewImei] = useState('');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newModel, setNewModel] = useState('');
  const [newReason, setNewReason] = useState<BlacklistEntry['reason']>('STOLEN');
  const [newFir, setNewFir] = useState('');

  const handleResolveIncident = (incidentId: string, action: 'BLOCKED' | 'APPROVED' | 'REPORTED') => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return { ...inc, status: action };
        }
        return inc;
      })
    );

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => (prev ? { ...prev, status: action } : null));
    }

    addToast({
      title: `Incident ${action}`,
      message: `Risk review marked as ${action}. Security log updated.`,
      type: action === 'APPROVED' ? 'success' : 'error'
    });
  };

  const handleLookupImei = () => {
    if (!lookupImei || lookupImei.length < 14) {
      addToast({ title: 'Invalid IMEI', message: 'Please enter a valid 15-digit IMEI number.', type: 'warning' });
      return;
    }

    const matchedInBlacklist = blacklist.find(b => b.imei === lookupImei.trim());
    if (matchedInBlacklist) {
      setLookupResult({
        checked: true,
        clean: false,
        details: `Blacklisted: ${matchedInBlacklist.reason} (${matchedInBlacklist.firNumber || 'Flagged in Registry'})`,
        gsmaStatus: 'BLACKLISTED_STOLEN'
      });
    } else {
      setLookupResult({
        checked: true,
        clean: true,
        details: 'Verified Clean: No records in CEIR or SELBAR Fraud Network.',
        gsmaStatus: 'CLEAN_VERIFIED'
      });
    }
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImei || newImei.length < 14) {
      addToast({ title: 'Invalid IMEI', message: 'Enter a valid 15-digit IMEI.', type: 'warning' });
      return;
    }

    const entry: BlacklistEntry = {
      id: `bl-${Date.now()}`,
      imei: newImei.trim(),
      brand: newBrand,
      model: newModel || 'Unspecified Device',
      reason: newReason,
      firNumber: newFir || undefined,
      reportedBy: 'Admin Security Operations',
      reportedAt: new Date().toISOString().split('T')[0]
    };

    setBlacklist(prev => [entry, ...prev]);
    setIsAddBlacklistOpen(false);
    setNewImei('');
    setNewModel('');
    setNewFir('');
    addToast({
      title: 'IMEI Blacklisted',
      message: `IMEI ${entry.imei} added to global fraud firewall. Buyback for this device is now hard-blocked.`,
      type: 'error'
    });
  };

  const criticalCount = incidents.filter(i => i.riskCategory === 'CRITICAL' && i.status === 'PENDING_REVIEW').length;
  const highCount = incidents.filter(i => i.riskCategory === 'HIGH' && i.status === 'PENDING_REVIEW').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fraud & Risk Management Engine</h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
              PRD Sec 38 & 48
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time automated fraud detection, duplicate IMEI prevention, stolen device CEIR registry integration, and payout protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('LOOKUP')}
          >
            <Smartphone className="mr-1.5 h-4 w-4 text-emerald-600" /> Verify IMEI Tool
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddBlacklistOpen(true)}
          >
            <Ban className="mr-1.5 h-4 w-4" /> Add Blacklist IMEI
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-red-700">Critical Risk Incidents</span>
            <div className="rounded-lg bg-red-100 p-2 text-red-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-red-700">{criticalCount}</div>
          <p className="mt-1 text-xs text-red-600">Immediate human review required</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-700">High Risk Alerts</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-700">{highCount}</div>
          <p className="mt-1 text-xs text-amber-600">Disparity or proxy detected</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Blacklisted IMEIs</span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{blacklist.length}</div>
          <p className="mt-1 text-xs text-slate-500">Hard-blocked from buyback</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Payout Loss Prevented</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">₹1,60,500</div>
          <p className="mt-1 text-xs text-slate-500">Saved by automated blocks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab('INCIDENTS')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === 'INCIDENTS'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" /> Flagged Transactions ({incidents.length})
        </button>

        <button
          onClick={() => setActiveTab('BLACKLIST')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === 'BLACKLIST'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Ban className="h-4 w-4" /> Global IMEI Blacklist ({blacklist.length})
        </button>

        <button
          onClick={() => setActiveTab('LOOKUP')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === 'LOOKUP'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="h-4 w-4" /> Live IMEI & CEIR Checker
        </button>
      </div>

      {/* Tab 1: INCIDENTS TABLE */}
      {activeTab === 'INCIDENTS' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Incident & Date</th>
                    <th className="px-4 py-3">Customer & IP</th>
                    <th className="px-4 py-3">Device & IMEI</th>
                    <th className="px-4 py-3">Value (Quote / Inspected)</th>
                    <th className="px-4 py-3">Risk Assessment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{inc.incidentId}</div>
                        <div className="text-xs text-slate-400">Quote #{inc.quoteId}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{inc.customerName}</div>
                        <div className="text-xs text-slate-500">{inc.customerPhone}</div>
                        <div className="text-[11px] font-mono text-slate-400">{inc.customerIp}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{inc.device.brand} {inc.device.model}</div>
                        <div className="font-mono text-xs text-slate-500">IMEI: {inc.device.imei}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">₹{inc.device.quotedValue.toLocaleString('en-IN')}</div>
                        {inc.device.inspectedValue && (
                          <div className="text-xs text-red-600 font-medium">
                            Inspected: ₹{inc.device.inspectedValue.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            inc.riskScore >= 80 ? 'bg-red-500 animate-pulse' : inc.riskScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span className="font-bold text-slate-900">{inc.riskScore}/100</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            inc.riskCategory === 'CRITICAL' ? 'bg-red-100 text-red-700' : inc.riskCategory === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {inc.riskCategory}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{inc.flags.length} risk flags triggered</div>
                      </td>

                      <td className="px-4 py-3">
                        {inc.status === 'BLOCKED' ? (
                          <Badge variant="danger">Blocked</Badge>
                        ) : inc.status === 'APPROVED' ? (
                          <Badge variant="success">Whitelisted</Badge>
                        ) : (
                          <Badge variant="warning">Under Review</Badge>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIncident(inc)}
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> Investigate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BLACKLIST */}
      {activeTab === 'BLACKLIST' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">IMEI Number</th>
                    <th className="px-4 py-3">Device Model</th>
                    <th className="px-4 py-3">Reason & FIR</th>
                    <th className="px-4 py-3">Reported By</th>
                    <th className="px-4 py-3">Date Added</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blacklist.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-red-600">
                        {entry.imei}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {entry.brand} {entry.model}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                          {entry.reason}
                        </span>
                        {entry.firNumber && (
                          <div className="text-xs text-slate-500 mt-0.5">{entry.firNumber}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {entry.reportedBy}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {entry.reportedAt}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setBlacklist(prev => prev.filter(b => b.id !== entry.id));
                            addToast({ title: 'Removed', message: `IMEI ${entry.imei} unblocked.`, type: 'info' });
                          }}
                        >
                          Unblock
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: LIVE IMEI LOOKUP TOOL */}
      {activeTab === 'LOOKUP' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" /> CEIR & GSMA IMEI Status Lookup
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Test any device IMEI before doorstep cash payout to ensure it has not been reported lost, stolen, or under active police investigation.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 15-digit Device IMEI (e.g. 357199201928371)"
              value={lookupImei}
              onChange={e => setLookupImei(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Button variant="primary" onClick={handleLookupImei}>
              <Search className="mr-1.5 h-4 w-4" /> Check Status
            </Button>
          </div>

          {lookupResult && (
            <div className={`rounded-xl border p-4 ${
              lookupResult.clean ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'
            }`}>
              <div className="flex items-start gap-3">
                {lookupResult.clean ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-bold text-base ${lookupResult.clean ? 'text-emerald-900' : 'text-red-900'}`}>
                    {lookupResult.clean ? 'Device Clean & Serviceable' : 'ALERT: Blacklisted Device Detected'}
                  </h4>
                  <p className={`text-sm mt-1 ${lookupResult.clean ? 'text-emerald-700' : 'text-red-700'}`}>
                    {lookupResult.details}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500">Registry Result:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      lookupResult.clean ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {lookupResult.gsmaStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Investigation Modal */}
      {selectedIncident && (
        <Modal
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`Fraud Investigation: ${selectedIncident.incidentId}`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-sm">
            {/* Top Score banner */}
            <div className={`rounded-xl p-4 border flex items-center justify-between ${
              selectedIncident.riskCategory === 'CRITICAL' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
            }`}>
              <div className="flex items-center gap-3">
                <ShieldAlert className={`h-8 w-8 ${
                  selectedIncident.riskCategory === 'CRITICAL' ? 'text-red-600' : 'text-amber-600'
                }`} />
                <div>
                  <h4 className="font-bold text-slate-900">
                    Risk Score: {selectedIncident.riskScore} / 100 ({selectedIncident.riskCategory} RISK)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Flagged for Quote #{selectedIncident.quoteId} on {new Date(selectedIncident.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div>
                <Badge variant={selectedIncident.status === 'BLOCKED' ? 'danger' : selectedIncident.status === 'APPROVED' ? 'success' : 'warning'}>
                  {selectedIncident.status}
                </Badge>
              </div>
            </div>

            {/* Device & User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900">Device Under Inspection</h4>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <p><span className="font-medium text-slate-800">Model:</span> {selectedIncident.device.brand} {selectedIncident.device.model}</p>
                  <p><span className="font-medium text-slate-800">IMEI:</span> <span className="font-mono font-bold text-slate-900">{selectedIncident.device.imei}</span></p>
                  <p><span className="font-medium text-slate-800">Online Quote:</span> ₹{selectedIncident.device.quotedValue.toLocaleString('en-IN')}</p>
                  {selectedIncident.device.inspectedValue && (
                    <p><span className="font-medium text-slate-800">Field Inspected Price:</span> ₹{selectedIncident.device.inspectedValue.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900">Seller & Origin Metadata</h4>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <p><span className="font-medium text-slate-800">Customer:</span> {selectedIncident.customerName}</p>
                  <p><span className="font-medium text-slate-800">Phone:</span> {selectedIncident.customerPhone}</p>
                  <p><span className="font-medium text-slate-800">IP Address:</span> <span className="font-mono">{selectedIncident.customerIp}</span></p>
                </div>
              </div>
            </div>

            {/* Triggered Risk Flags */}
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
                <Flag className="h-4 w-4 text-red-600" /> Triggered Heuristic & CEIR Flags
              </h4>
              <div className="space-y-2">
                {selectedIncident.flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                    <span className={`shrink-0 font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {flag.code}
                    </span>
                    <p className="text-slate-700 font-medium">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div className="text-xs text-slate-500">
                Action will be permanently recorded in immutable audit logs.
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-700 hover:bg-red-50 hover:border-red-300"
                  onClick={() => handleResolveIncident(selectedIncident.id, 'BLOCKED')}
                >
                  <Ban className="mr-1.5 h-3.5 w-3.5" /> Hard Block & Hold Payout
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleResolveIncident(selectedIncident.id, 'APPROVED')}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Whitelist & Approve
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Blacklist Modal */}
      <Modal
        isOpen={isAddBlacklistOpen}
        onClose={() => setIsAddBlacklistOpen(false)}
        title="Add Device IMEI to Global Blacklist"
        maxWidth="md"
      >
        <form onSubmit={handleAddBlacklist} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">15-Digit Device IMEI *</label>
            <input
              type="text"
              required
              placeholder="e.g. 358920192837482"
              value={newImei}
              onChange={e => setNewImei(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">Brand</label>
              <select
                value={newBrand}
                onChange={e => setNewBrand(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Vivo">Vivo</option>
                <option value="Google">Google</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500">Model</label>
              <input
                type="text"
                placeholder="e.g. iPhone 14 Pro"
                value={newModel}
                onChange={e => setNewModel(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">Blacklist Reason *</label>
            <select
              value={newReason}
              onChange={e => setNewReason(e.target.value as BlacklistEntry['reason'])}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="STOLEN">Reported Stolen</option>
              <option value="POLICE_FIR">Police FIR Registered</option>
              <option value="FINANCE_DEFAULT">EMI / Finance Default</option>
              <option value="COUNTERFEIT">Counterfeit / Clone Device</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">Police FIR / Incident No. (Optional)</label>
            <input
              type="text"
              placeholder="e.g. FIR #302/2026 Town PS"
              value={newFir}
              onChange={e => setNewFir(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddBlacklistOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save to Blacklist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
