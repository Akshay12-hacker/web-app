'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '@/utils/normalizers';

export const DashboardStats: React.FC<{
  plot: any;
  onPayPress: () => void;
  onHistoryPress: () => void;
}> = ({ plot, onPayPress, onHistoryPress }) => {
  const pendingDue = plot?.pendingDue || 0;

  return (
    <Card className="bg-white p-6 -mt-6 relative z-20 shadow-xl border-none">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">TOTAL OUTSTANDING</p>
          <h3 className="text-3xl font-black text-text-primary">{formatCurrency(pendingDue)}</h3>
          <p className="text-xs font-bold text-success">Due by 15th {new Date().toLocaleDateString('en-IN', { month: 'short' })}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <span className="text-2xl text-primary">💳</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={onPayPress}
          className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
        >
          Pay Now
        </button>
        <button 
          onClick={onHistoryPress}
          className="w-14 h-14 bg-surface-alt text-text-primary rounded-2xl flex items-center justify-center border border-border active:scale-[0.98] transition-transform"
        >
          🕒
        </button>
      </div>
    </Card>
  );
};
