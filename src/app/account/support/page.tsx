'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { StatusBadge, PageHeader, SectionCard, SectionHeader, Toast, EmptyState } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import type { SupportTicket, TicketMessage as TicketMessageType } from '@/types/account';
import {
  LifeBuoy, Plus, MessageSquare, Send, Clock, ChevronRight,
  Paperclip, HelpCircle, ChevronDown
} from 'lucide-react';

const TICKET_CATEGORIES = [
  'Order & Delivery', 'Returns & Refunds', 'Payment Issues', 'Product Quality',
  'Account & Security', 'Technical Issue', 'Feedback & Suggestion', 'Other',
];

const FAQS = [
  { q: 'How do I track my order?', a: 'Go to My Orders and click on your order to see real-time tracking. You will also receive SMS/email updates.' },
  { q: 'What is the return policy?', a: 'Most products can be returned within 7 days of delivery. Items must be unused, in original packaging, and with all accessories.' },
  { q: 'How long does refund take?', a: 'Refunds are processed within 5-7 business days after the returned item is inspected. UPI refunds are usually faster (1-3 days).' },
  { q: 'Can I change my delivery address?', a: 'You can change the address before the order is shipped. Contact support immediately after placing the order.' },
  { q: 'How do I cancel my order?', a: 'Orders can be cancelled before they are shipped. Go to Order Details and click Cancel. Once shipped, you need to initiate a return.' },
];

function TicketMessage({ msg }: { msg: TicketMessageType }) {
  const isCustomer = msg.sender === 'CUSTOMER';
  return (
    <div className={`flex gap-3 ${isCustomer ? 'flex-row-reverse' : ''}`}>
      <div className="h-8 w-8 rounded-full overflow-hidden shrink-0">
        {msg.senderAvatar ? (
          <img src={msg.senderAvatar} alt={msg.senderName} className="h-full w-full object-cover" />
        ) : (
          <div className={`h-full w-full flex items-center justify-center text-white text-xs font-bold ${isCustomer ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            {msg.senderName.charAt(0)}
          </div>
        )}
      </div>
      <div className={`max-w-[75%] ${isCustomer ? 'items-end' : 'items-start'} flex flex-col`}>
        <p className="text-[10px] text-slate-400 mb-1 px-1">{msg.senderName}</p>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isCustomer
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-slate-100 text-slate-800 rounded-tl-sm'
        }`}>
          {msg.content}
        </div>
        <p className="text-[10px] text-slate-400 mt-1 px-1">
          {new Date(msg.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function TicketDetail({ ticket, onBack }: { ticket: SupportTicket; onBack: () => void }) {
  const [reply, setReply] = useState('');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <button onClick={onBack} className="text-xs text-blue-600 font-semibold hover:underline mb-2">← Back to tickets</button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">{ticket.subject}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{ticket.ticketId} · {ticket.category}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {ticket.messages.map(msg => (
          <TicketMessage key={msg.id} msg={msg} />
        ))}
      </div>

      {/* Reply */}
      {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex gap-3">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <div className="flex flex-col gap-2">
              <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50">
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setReply(''); }}
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SupportContent() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [newTicket, setNewTicket] = useState({ subject: '', category: '', description: '' });

  useEffect(() => {
    accountService.getTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewForm(false);
    setNewTicket({ subject: '', category: '', description: '' });
    setToast('Support ticket submitted! We will respond within 4 hours.');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader
        title="Support Center"
        description="Get help with orders, returns, and account issues"
        action={
          !showNewForm && !activeTicket ? (
            <button
              onClick={() => setShowNewForm(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </button>
          ) : undefined
        }
      />

      {/* New Ticket Form */}
      {showNewForm && (
        <SectionCard className="mb-6">
          <SectionHeader title="Create Support Ticket" />
          <form onSubmit={handleSubmitTicket} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category *</label>
              <select
                required
                value={newTicket.category}
                onChange={e => setNewTicket(t => ({ ...t, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
              >
                <option value="">Select issue category</option>
                {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Subject *</label>
              <input
                required
                value={newTicket.subject}
                onChange={e => setNewTicket(t => ({ ...t, subject: e.target.value }))}
                placeholder="Briefly describe your issue"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Description *</label>
              <textarea
                required
                rows={4}
                value={newTicket.description}
                onChange={e => setNewTicket(t => ({ ...t, description: e.target.value }))}
                placeholder="Describe your issue in detail. Include order IDs if relevant..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                Submit Ticket
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {/* Ticket Detail */}
      {activeTicket && (
        <SectionCard className="mb-6 min-h-96">
          <TicketDetail ticket={activeTicket} onBack={() => setActiveTicket(null)} />
        </SectionCard>
      )}

      {/* Ticket List */}
      {!activeTicket && (
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <SectionCard>
              <SectionHeader title={`My Tickets (${tickets.length})`} />
              {tickets.length === 0 ? (
                <EmptyState
                  icon={<MessageSquare className="h-8 w-8" />}
                  title="No support tickets"
                  description="Have an issue? Create a ticket and we'll help you quickly."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {tickets.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTicket(t)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition text-left"
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        t.status === 'IN_PROGRESS' ? 'bg-purple-100' :
                        t.status === 'RESOLVED' ? 'bg-emerald-100' :
                        'bg-blue-100'
                      }`}>
                        <LifeBuoy className={`h-4 w-4 ${
                          t.status === 'IN_PROGRESS' ? 'text-purple-600' :
                          t.status === 'RESOLVED' ? 'text-emerald-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-bold text-slate-400">{t.ticketId}</p>
                          <StatusBadge status={t.status} />
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate">{t.subject}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t.category} · {new Date(t.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">{t.messages.length} messages</span>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {/* FAQ */}
          <SectionCard>
            <SectionHeader title="Frequently Asked Questions" />
            <div className="divide-y divide-slate-100">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-slate-50 transition"
                  >
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function SupportPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <SupportContent />
    </AccountLayout>
  );
}
