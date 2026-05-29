'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '@/utils/normalizers';

export const SocietyFundCard: React.FC<{
  fund: any;
  onPress: () => void;
}> = ({ fund, onPress }) => {
  const balance = fund?.totalBalance || 0;

  return (
    <Card onClick={onPress} className="bg-primary p-6 text-white border-none shadow-xl shadow-primary/20">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">SOCIETY CORPUS FUND</p>
          <h3 className="text-2xl font-black">{formatCurrency(balance)}</h3>
        </div>
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
          <span className="text-xl">💰</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-1">INCOME</p>
          <p className="text-sm font-black text-success">+{formatCurrency(fund?.collected || 0)}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-1">EXPENSES</p>
          <p className="text-sm font-black text-error">-{formatCurrency(fund?.spent || 0)}</p>
        </div>
      </div>
    </Card>
  );
};
