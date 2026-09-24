'use client';

import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  Check,
  X,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { RoleType, PermissionModule } from '@/types/admin';
import { INITIAL_PERMISSION_MODULES } from '@/services/adminMockData';
import { useAdmin } from '@/context/AdminContext';

export default function AdminRolesPage() {
  const { addToast } = useAdmin();
  const [activeRole, setActiveRole] = useState<RoleType>('Super Admin');
  const [modules, setModules] = useState<PermissionModule[]>(INITIAL_PERMISSION_MODULES);
  const [isSaving, setIsSaving] = useState(false);

  const togglePermission = (moduleKey: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export') => {
    if (activeRole === 'Super Admin') {
      addToast({ title: 'Root Locked', message: 'Super Admin retains full system permissions.', type: 'info' });
      return;
    }
    setModules(prev =>
      prev.map(m => {
        if (m.module === moduleKey) {
          return {
            ...m,
            actions: {
              ...m.actions,
              [action]: !m.actions[action],
            },
          };
        }
        return m;
      })
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'Permissions Saved',
        message: `Updated RBAC security matrix for ${activeRole}.`,
        type: 'success',
      });
    }, 400);
  };

  const roles: RoleType[] = [
    'Super Admin',
    'Admin',
    'Order Manager',
    'Product Manager',
    'Marketing Manager',
    'Support Agent',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Role-Based Access Control (RBAC)
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Define fine-grained operational permissions across functional modules and actions
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Role Permissions
        </Button>
      </div>

      {/* Role Picker Bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
        {roles.map(r => (
          <button
            key={r}
            onClick={() => setActiveRole(r)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeRole === r
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              Permission Matrix for: {activeRole}
            </span>
          </div>
          {activeRole === 'Super Admin' && (
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
              <Lock className="h-3 w-3" /> Full Root Clearance (Non-revocable)
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Functional Module</th>
                <th className="px-4 py-3 font-semibold text-center">View</th>
                <th className="px-4 py-3 font-semibold text-center">Create</th>
                <th className="px-4 py-3 font-semibold text-center">Edit</th>
                <th className="px-4 py-3 font-semibold text-center">Delete</th>
                <th className="px-4 py-3 font-semibold text-center">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {modules.map(m => (
                <tr key={m.module} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                    {m.label}
                  </td>
                  {(['view', 'create', 'edit', 'delete', 'export'] as const).map(action => {
                    const isGranted = activeRole === 'Super Admin' ? true : m.actions[action];
                    return (
                      <td key={action} className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => togglePermission(m.module, action)}
                          disabled={activeRole === 'Super Admin'}
                          className={`inline-flex h-6 w-6 items-center justify-center rounded cursor-pointer transition-colors ${
                            isGranted
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                          }`}
                        >
                          {isGranted ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
