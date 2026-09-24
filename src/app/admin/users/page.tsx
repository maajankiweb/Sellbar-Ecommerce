'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Shield,
  KeyRound,
  Trash2,
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { AdminUser, RoleType } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminUsersPage() {
  const { addToast } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New User Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleType>('Order Manager');

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await adminService.getAdminUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    if (!name || !email) return;
    const u: AdminUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: '+91 98000 00000',
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: false,
    };
    setUsers(prev => [u, ...prev]);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    addToast({ title: 'Admin Invited', message: `Invitation sent to ${email}`, type: 'success' });
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      sortable: true,
      render: u => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar}
            alt={u.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-xs">
              {u.name}
            </div>
            <div className="text-[11px] text-slate-400">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: u => (
        <Badge
          variant={u.role === 'Super Admin' ? 'purple' : 'info'}
          size="sm"
        >
          {u.role}
        </Badge>
      ),
    },
    {
      key: 'twoFactorEnabled',
      header: '2FA Auth',
      render: u => (
        <span
          className={`text-xs font-semibold ${
            u.twoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          {u.twoFactorEnabled ? 'Enforced' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Active Session',
      sortable: true,
      render: u => (
        <span className="text-xs text-slate-400 font-mono">
          {u.lastLogin}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: u => (
        <Badge variant={u.status === 'active' ? 'success' : 'neutral'} size="sm" dot>
          {u.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Team & Access Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Control organizational employee roles, multi-factor authentication, and terminal permissions
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Invite Admin User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyField="id"
        searchPlaceholder="Search admin staff by name or email..."
        exportFilename="selbar_admin_team"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite New Administrator"
        description="Assign security clearance and module access"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Send Invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Vikram Malhotra"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Corporate Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vikram@selbar.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as RoleType)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="Super Admin">Super Admin (Full Root Clearance)</option>
              <option value="Order Manager">Order Manager (Fulfillment & Returns)</option>
              <option value="Product Manager">Product Manager (Catalog & Pricing)</option>
              <option value="Marketing Manager">Marketing Manager (Campaigns & Discounts)</option>
              <option value="Support Agent">Support Agent (Customer Tickets)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
