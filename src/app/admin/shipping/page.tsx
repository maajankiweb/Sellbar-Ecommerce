'use client';

import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  Package,
  ExternalLink
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';

interface DeliveryPartner {
  id: string;
  name: string;
  service: string;
  avgTat: string;
  status: 'active' | 'standby';
  coverage: string;
  apiConnected: boolean;
}

export default function AdminShippingPage() {
  const partners: DeliveryPartner[] = [
    { id: 'p-1', name: 'BlueDart Express Air', service: 'Air Priority & Fragile Tech', avgTat: '24-48 Hours', status: 'active', coverage: '18,500+ Pincodes', apiConnected: true },
    { id: 'p-2', name: 'Delhivery Surface', service: 'Standard Ground Delivery', avgTat: '2-4 Days', status: 'active', coverage: '19,200+ Pincodes', apiConnected: true },
    { id: 'p-3', name: 'Shiprocket Multi-Carrier', service: 'Aggregator Routing', avgTat: '2-5 Days', status: 'active', coverage: '24,000+ Pincodes', apiConnected: true },
    { id: 'p-4', name: 'Shadowfax Local Hyper', service: 'Same-day Metro Delivery', avgTat: '4-8 Hours', status: 'standby', coverage: 'Tier 1 Metros', apiConnected: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Logistics & Shipping Operations
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Carrier API integrations, SLA delivery guarantees, AWB generation, and regional pincode zones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Shipments"
          value="42 parcels"
          icon={<Truck className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="On-Time Delivery SLA"
          value="98.4%"
          change={1.2}
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Average Metro TAT"
          value="1.8 Days"
          icon={<Clock className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Courier Partners Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Integrated Courier Partners
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map(p => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{p.service}</p>
                  </div>
                  <Badge variant={p.status === 'active' ? 'success' : 'neutral'} size="sm" dot>
                    {p.status}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-500">
                    <span>Average Delivery TAT</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {p.avgTat}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Nationwide Coverage</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {p.coverage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> API Connected
                </span>
                <Button variant="outline" size="sm">
                  Config Rates
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
