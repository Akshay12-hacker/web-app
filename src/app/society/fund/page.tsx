'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getSocietyFund, getExpenseHistory } from '@/services/societyApi';
import { formatCurrency, formatDate } from '@/utils/normalizers';
import { Card } from '@/components/ui/Card';

interface Expense {
  id: string;
  remark: string;
  amount: number;
  date: string;
  mode: number;
  imageUrl?: string;
}

export default function SocietyFundPage() {
  const router = useRouter();
  const { activeProfile } = useAuth();
  
  const [fund, setFund] = useState<any>(null);
  const [historyItems, setHistoryItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFund = useCallback(async () => {
    if (!activeProfile?.societyId) return;
    const data = await getSocietyFund(activeProfile.societyId);
    setFund(data);
  }, [activeProfile]);

  const fetchHistory = useCallback(async (p: number, append: boolean) => {
    if (!activeProfile?.societyId) return;
    if (append) setLoadingMore(true);
    else setLoading(true);

    const res = await getExpenseHistory(activeProfile.societyId, { pageNumber: p, pageSize: 6 });
    
    if (append) {
      setHistoryItems(prev => [...prev, ...res.items]);
    } else {
      setHistoryItems(res.items);
      setTotalCount(res.totalCount);
    }
    setPage(res.pageNumber);
    setLoading(false);
    setLoadingMore(false);
  }, [activeProfile]);

  useEffect(() => {
    fetchFund();
    fetchHistory(1, false);
  }, [fetchFund, fetchHistory]);

  const pct = fund?.collected > 0 ? Math.round((fund.totalBalance / fund.collected) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background-custom">
      <div className="bg-primary-dark px-6 pt-12 pb-16 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
        
        <div className="relative z-10">
          <h1 className="text-white text-3xl font-black tracking-tight">Society Fund</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Real-time utilization and reserve</p>

          <Card className="mt-8 bg-white/10 border-white/10 backdrop-blur-md p-6 text-white border-none shadow-none">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">AVAILABLE RESERVE</p>
                <h2 className="text-4xl font-black mt-1 tracking-tighter">{formatCurrency(fund?.totalBalance || 0)}</h2>
              </div>
              <div className={`px-2 py-1 rounded-md text-[9px] font-black tracking-wider uppercase
                ${pct > 50 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}
              `}>
                {pct}% Robust
              </div>
            </div>

            <div className="mt-6 mb-6">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex gap-6 border-t border-white/5 pt-6">
              <div className="flex-1">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">COLLECTED</p>
                <p className="text-lg font-black mt-0.5">{formatCurrency(fund?.collected || 0)}</p>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">TOTAL SPENT</p>
                <p className="text-lg font-black mt-0.5 text-error-light/80">{formatCurrency(fund?.spent || 0)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-black text-text-primary tracking-tight">Utilization History ({totalCount})</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface-alt rounded-2xl animate-pulse" />)}
          </div>
        ) : historyItems.length > 0 ? (
          <div className="space-y-3">
            <Card className="p-0 overflow-hidden border-border bg-white shadow-sm">
              {historyItems.map((item: Expense, i: number) => (
                <div key={item.id} className={`flex items-center gap-4 p-5 ${i < historyItems.length - 1 ? 'border-b border-divider' : ''}`}>
                  <div className="w-11 h-11 bg-warning/5 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">
                      {item.mode === 1 ? '💵' : item.mode === 2 ? '📱' : item.mode === 3 ? '🏦' : '📊'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-text-primary truncate">{item.remark}</h3>
                    <p className="text-xs text-text-muted mt-0.5 font-medium">{formatDate(item.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-error">-{formatCurrency(item.amount)}</p>
                    {item.imageUrl && (
                      <span className="text-xs">📎</span>
                    )}
                  </div>
                </div>
              ))}
            </Card>

            {historyItems.length < totalCount && (
              <button
                onClick={() => fetchHistory(page + 1, true)}
                disabled={loadingMore}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-primary font-bold text-sm hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More Utilization'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍃</span>
            </div>
            <h3 className="text-xl font-black text-text-primary">No utilization yet</h3>
            <p className="text-sm text-text-muted mt-2 px-4 leading-relaxed">
              The society fund utilization records will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
