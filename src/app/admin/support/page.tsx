'use client';

import React, { useState, useEffect } from 'react';
import {
  Headphones,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Search,
  Eye,
  Filter
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { SupportTicket } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSupportPage() {
  const { addToast } = useAdmin();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    const data = await adminService.getSupportTickets();
    setTickets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = (id: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
    setSelectedTicket(null);
    addToast({ title: 'Ticket Resolved', message: 'Ticket marked as resolved and customer notified.', type: 'success' });
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: 'ticketNumber',
      header: 'Ticket ID',
      sortable: true,
      render: t => (
        <div>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
            {t.ticketNumber}
          </span>
          <span className="text-[11px] text-slate-400">{t.category}</span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: t => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block text-xs">
            {t.customerName}
          </span>
          <span className="text-[11px] text-slate-400">{t.customerEmail}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Inquiry',
      render: t => (
        <div className="max-w-md text-xs font-medium text-slate-800 dark:text-slate-200">
          {t.subject}
          <div className="text-[11px] text-slate-400 mt-0.5">
            {t.messagesCount} message thread • Last updated {t.lastUpdated}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: t => (
        <Badge
          variant={
            t.priority === 'urgent'
              ? 'danger'
              : t.priority === 'high'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        >
          {t.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: t => (
        <Badge
          variant={
            t.status === 'open'
              ? 'warning'
              : t.status === 'in_progress'
              ? 'info'
              : 'success'
          }
          size="sm"
          dot={t.status === 'open'}
        >
          {t.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: t => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedTicket(t)}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Customer Support Helpdesk
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Respond to order disputes, delivery escalations, and technical refund tickets
        </p>
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        keyField="id"
        searchPlaceholder="Search tickets by subject, ID or customer..."
        exportFilename="selbar_support_tickets"
      />

      {/* Ticket Inspect Modal */}
      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={`Ticket ${selectedTicket?.ticketNumber}: ${selectedTicket?.subject}`}
        description={`Customer: ${selectedTicket?.customerName} (${selectedTicket?.customerEmail})`}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Close
            </Button>
            {selectedTicket?.status !== 'resolved' && (
              <Button
                variant="primary"
                onClick={() => selectedTicket && handleResolve(selectedTicket.id)}
              >
                Mark as Resolved
              </Button>
            )}
          </>
        }
      >
        {selectedTicket && (
          <div className="space-y-4 text-xs">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <span className="font-semibold text-slate-500 block mb-1">
                Customer Message:
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                &quot;Hi team, I ordered the Apple iPhone 15 Pro and wanted to verify if delivery to Noida Sector 44 requires gate pass clearance or if the courier partner will call before arrival?&quot;
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Agent Internal Response
              </label>
              <textarea
                rows={3}
                placeholder="Type response to send to customer via email & SMS..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
