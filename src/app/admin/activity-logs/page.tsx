'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { adminService } from '@/services/adminService';
import { ActivityLogItem } from '@/types/admin';

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await adminService.getActivityLogs();
      setLogs(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const columns: Column<ActivityLogItem>[] = [
    {
      key: 'adminName',
      header: 'Admin / Initiator',
      sortable: true,
      render: l => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {l.adminName}
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            {l.adminRole}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: l => (
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {l.action}
        </span>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      sortable: true,
      render: l => (
        <Badge variant="neutral" size="sm">
          {l.module}
        </Badge>
      ),
    },
    {
      key: 'description',
      header: 'Audit Event Description',
      render: l => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {l.description}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Origin',
      render: l => (
        <span className="font-mono text-xs text-slate-400">
          {l.ipAddress}
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: l => (
        <span className="text-xs text-slate-400 font-mono">
          {l.timestamp}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Security & Operational Audit Trail
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Immutable event log of administrative mutations, inventory shifts, status updates, and session logins
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        keyField="id"
        searchPlaceholder="Search audit trail by admin, action or details..."
        exportFilename="selbar_security_audit_logs"
      />
    </div>
  );
}
