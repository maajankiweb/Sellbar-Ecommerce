'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  XCircle,
  DollarSign,
  Plus,
  Minus,
  SlidersHorizontal,
  History,
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { InventoryItem } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminInventoryPage() {
  const { addToast } = useAdmin();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Adjust stock modal state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [delta, setDelta] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Supplier Restock Delivery');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    const data = await adminService.getInventory({ status: statusFilter });
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const totalUnits = items.reduce((acc, i) => acc + i.stock, 0);
  const inStockCount = items.filter(i => i.status === 'in_stock').length;
  const lowStockCount = items.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = items.filter(i => i.status === 'out_of_stock').length;
  const totalValuation = items.reduce((acc, i) => acc + i.totalValue, 0);

  const handleAdjustStock = async () => {
    if (!selectedItem || delta === 0) return;
    setIsAdjusting(true);
    await adminService.adjustStock(selectedItem.sku, delta, adjustReason);
    addToast({
      title: 'Stock Updated',
      message: `Adjusted ${selectedItem.name} by ${delta > 0 ? '+' : ''}${delta} units.`,
      type: 'success',
    });
    setIsAdjusting(false);
    setSelectedItem(null);
    setDelta(0);
    fetchInventory();
  };

  const columns: Column<InventoryItem>[] = [
    {
      key: 'name',
      header: 'Product Item',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <img
            src={item.image}
            alt={item.name}
            className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 dark:text-white truncate">
              {item.name}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              SKU: {item.sku} • {item.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'On Hand',
      sortable: true,
      render: item => (
        <span className="font-bold text-slate-900 dark:text-white">
          {item.stock}
        </span>
      ),
    },
    {
      key: 'reserved',
      header: 'Reserved',
      render: item => (
        <span className="text-slate-500 font-medium">
          {item.reserved} units
        </span>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      sortable: true,
      render: item => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {item.available}
        </span>
      ),
    },
    {
      key: 'reorderLevel',
      header: 'Reorder Level',
      render: item => (
        <span className="text-xs text-slate-400">
          Threshold: {item.reorderLevel}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <Badge
          variant={
            item.status === 'in_stock'
              ? 'success'
              : item.status === 'low_stock'
              ? 'warning'
              : 'danger'
          }
          size="sm"
          dot={item.status === 'in_stock'}
        >
          {item.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'totalValue',
      header: 'Valuation',
      sortable: true,
      render: item => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          ₹{item.totalValue.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: item => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedItem(item);
            setDelta(0);
          }}
        >
          Adjust Stock
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Inventory Control Center
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Monitor physical warehouse stocks, buffer thresholds, reserved orders, and inventory asset valuation
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={<Boxes className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="In Stock"
          value={inStockCount}
          icon={<PackageCheck className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Low Stock"
          value={lowStockCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={<XCircle className="h-4 w-4" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Stock Valuation"
          value={`₹${(totalValuation / 100000).toFixed(1)}L`}
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={items}
        keyField="id"
        searchPlaceholder="Search inventory by product name or SKU..."
        searchField={i => `${i.name} ${i.sku}`}
        exportFilename="selbar_warehouse_inventory"
        filterOptions={[
          {
            label: 'Status',
            currentValue: statusFilter,
            onFilterChange: setStatusFilter,
            options: [
              { label: 'All Stock Levels', value: 'all' },
              { label: 'In Stock', value: 'in_stock' },
              { label: 'Low Stock', value: 'low_stock' },
              { label: 'Out of Stock', value: 'out_of_stock' },
            ],
          },
        ]}
      />

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title="Physical Stock Adjustment"
        description={`Modify registered count for ${selectedItem?.name} (SKU: ${selectedItem?.sku})`}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAdjustStock}
              disabled={delta === 0}
              isLoading={isAdjusting}
            >
              Confirm Adjustment
            </Button>
          </>
        }
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <span className="text-xs text-slate-500">Current Stock:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedItem.stock} units
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Adjustment Count (+/-)
              </label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setDelta(prev => prev - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={delta}
                  onChange={e => setDelta(Number(e.target.value))}
                  className="w-28 text-center rounded-lg border border-slate-300 py-1.5 text-base font-bold dark:border-slate-700 dark:bg-slate-800"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setDelta(prev => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-xs text-slate-500">
                  New total: <strong>{Math.max(0, selectedItem.stock + delta)}</strong> units
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reason for Adjustment
              </label>
              <select
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Supplier Restock Delivery">Supplier Restock Delivery</option>
                <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
                <option value="Damaged in Warehouse Transit">Damaged in Warehouse Transit</option>
                <option value="Customer Return Restocked">Customer Return Restocked</option>
                <option value="Internal Demo Unit Allocation">Internal Demo Unit Allocation</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
