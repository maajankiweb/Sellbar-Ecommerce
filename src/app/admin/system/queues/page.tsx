'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  RefreshCw,
  Play,
  Pause,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Activity,
  Server,
} from 'lucide-react';

interface QueueStat {
  name: string;
  isPaused: boolean;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}

interface JobItem {
  id: string;
  name: string;
  data: any;
  failedReason?: string;
  attemptsMade: number;
  timestamp: number;
}

export default function AdminQueuesDashboard() {
  const [queues, setQueues] = useState<QueueStat[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('email');
  const [jobStatusFilter, setJobStatusFilter] = useState<'failed' | 'completed' | 'active' | 'waiting'>('failed');
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchQueueData = async (queueKey?: string, status?: string) => {
    try {
      const q = queueKey || selectedQueue;
      const s = status || jobStatusFilter;
      const res = await fetch(`/api/v1/admin/system/queues?queue=${q}&status=${s}`);
      const data = await res.json();
      if (data.success) {
        setQueues(data.data.queues || []);
        setJobs(data.data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch queues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchQueueData();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedQueue, jobStatusFilter, autoRefresh]);

  const handleQueueAction = async (action: string, jobId?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/v1/admin/system/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, queue: selectedQueue, jobId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchQueueData();
      }
    } catch (err) {
      console.error('Queue action failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const selectedQueueData = queues.find((q) => q.name === selectedQueue);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">BullMQ Mission Control</h1>
              <p className="text-sm text-slate-400">Real-time background worker & job queue telemetry</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {autoRefresh ? 'Live Auto-Polling (5s)' : 'Polling Paused'}
          </button>

          <button
            onClick={() => fetchQueueData()}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            title="Refresh Now"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Queue Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {queues.map((q) => {
          const isSelected = q.name === selectedQueue;
          return (
            <div
              key={q.name}
              onClick={() => setSelectedQueue(q.name)}
              className={`p-6 rounded-2xl cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-lg uppercase tracking-wide">{q.name}</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    q.isPaused
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {q.isPaused ? 'PAUSED' : 'ONLINE'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <div className="text-xs text-slate-400">Waiting</div>
                  <div className="text-base font-bold text-amber-400">{q.waiting}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <div className="text-xs text-slate-400">Active</div>
                  <div className="text-base font-bold text-blue-400">{q.active}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <div className="text-xs text-slate-400">Done</div>
                  <div className="text-base font-bold text-emerald-400">{q.completed}</div>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <div className="text-xs text-slate-400">Failed</div>
                  <div className="text-base font-bold text-rose-400">{q.failed}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Queue Controls & Job Inspector */}
      {selectedQueueData && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Queue: <span className="text-blue-400 uppercase">{selectedQueueData.name}</span>
              </h2>
              <p className="text-sm text-slate-400">Manage worker state, retry failures, and clean stalled jobs</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQueueAction('toggle-pause')}
                disabled={actionLoading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 border border-slate-700 transition"
              >
                {selectedQueueData.isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                {selectedQueueData.isPaused ? 'Resume Processing' : 'Pause Queue'}
              </button>

              <button
                onClick={() => handleQueueAction('clean')}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold flex items-center gap-2 border border-rose-500/30 transition"
              >
                <Trash2 className="w-4 h-4" />
                Flush Failed
              </button>
            </div>
          </div>

          {/* Job Filter Tabs */}
          <div className="flex items-center gap-2 my-6">
            {(['failed', 'waiting', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setJobStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                  jobStatusFilter === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab} ({selectedQueueData[tab]})
              </button>
            ))}
          </div>

          {/* Jobs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Job ID</th>
                  <th className="p-4">Job Name</th>
                  <th className="p-4">Attempts</th>
                  <th className="p-4">Timestamp</th>
                  {jobStatusFilter === 'failed' && <th className="p-4">Failure Reason</th>}
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No jobs currently in <span className="font-semibold">{jobStatusFilter}</span> state.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono text-xs text-blue-400">{job.id}</td>
                      <td className="p-4 font-semibold">{job.name}</td>
                      <td className="p-4">{job.attemptsMade}</td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(job.timestamp).toLocaleTimeString()}
                      </td>
                      {jobStatusFilter === 'failed' && (
                        <td className="p-4 text-xs text-rose-400 font-mono max-w-md truncate">
                          {job.failedReason || 'Unknown error'}
                        </td>
                      )}
                      <td className="p-4 text-right">
                        {jobStatusFilter === 'failed' && (
                          <button
                            onClick={() => handleQueueAction('retry', job.id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold rounded-lg border border-blue-500/30 inline-flex items-center gap-1.5 transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
