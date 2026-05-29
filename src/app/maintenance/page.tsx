'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getMaintenanceDue } from '@/services/societyApi';
import { formatCurrency, normalizePlot } from '@/utils/normalizers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MaintenancePage() {
  const router = useRouter();
  const { activeProfile } = useAuth();
  
  const [activePlotIdx, setActivePlotIdx] = useState(0);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const plots = useMemo(() => {
    return (activeProfile?.unitOwner || []).map((p: any, i: number) => normalizePlot(p, i));
  }, [activeProfile]);

  const activePlot = plots[activePlotIdx];

  useEffect(() => {
    if (activePlot) {
      const fetchDues = async () => {
        setLoading(true);
        const data = await getMaintenanceDue(activePlot.societyId, activePlot.ownerId, activePlot.unitId);
        const dataArray = Array.isArray(data) ? data : [data];
        const normalized = dataArray.map((row: any, idx: number) => {
          const actualId = row.ledgerId ?? row.id ?? idx;
          return {
            id: String(actualId),
            monthYear: row.monthYear || `${row.month}/${row.year}` || `Dues #${idx + 1}`,
            amount: Number(row.pendingAmount ?? row.amount ?? 0),
            lateCharge: Number(row.lateFee ?? row.lateCharge ?? 0),
            gst: Number(row.gst ?? 0),
          };
        }).filter(r => r.amount > 0);
        setRows(normalized);
        setSelectedIds(new Set());
        setLoading(false);
      };
      fetchDues();
    }
  }, [activePlot]);

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const totalAmount = useMemo(() => {
    return rows
      .filter(r => selectedIds.has(r.id))
      .reduce((sum, r) => sum + r.amount + r.lateCharge + r.gst, 0);
  }, [rows, selectedIds]);

  return (
    <div className="flex flex-col min-h-screen bg-background-custom pb-40">
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Maintenance</h1>
        <p className="text-text-muted text-sm mt-2 font-medium">Select dues to complete your secure payment.</p>
      </div>

      {/* Plot Switcher */}
      <div className="flex gap-4 px-6 overflow-x-auto pb-6 scrollbar-hide">
        {plots.map((plot, i) => (
          <button
            key={i}
            onClick={() => setActivePlotIdx(i)}
            className={`flex-shrink-0 w-64 rounded-3xl p-5 border-2 transition-all text-left
              ${activePlotIdx === i ? 'border-primary bg-white shadow-lg' : 'border-border bg-surface-alt'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-black text-text-primary">{plot.plotNo}</span>
              <span className="bg-black/5 px-2 py-1 rounded-md text-[9px] font-black text-text-muted uppercase tracking-wider">
                {plot.type}
              </span>
            </div>
            <p className="text-xs font-bold text-text-muted truncate mb-2">{plot.societyName}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">{plot.pendingDue > 0 ? "🚨" : "✅"}</span>
              <span className={`text-base font-black ${plot.pendingDue > 0 ? 'text-error' : 'text-success'}`}>
                {plot.pendingDue > 0 ? formatCurrency(plot.pendingDue) : "CLEARED"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Dues List */}
      <div className="px-6 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-black text-text-primary tracking-tight">Pending Payments</h2>
          {rows.length > 0 && (
            <button 
              onClick={() => setSelectedIds(selectedIds.size === rows.length ? new Set() : new Set(rows.map(r => r.id)))}
              className="text-xs font-black text-primary uppercase tracking-wider"
            >
              {selectedIds.size === rows.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-surface-alt rounded-2xl" />)}
          </div>
        ) : rows.length > 0 ? (
          rows.map((row) => (
            <div
              key={row.id}
              onClick={() => toggleRow(row.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer
                ${selectedIds.has(row.id) ? 'border-primary bg-white shadow-md' : 'border-border bg-white'}
              `}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors
                ${selectedIds.has(row.id) ? 'border-primary bg-primary' : 'border-border'}
              `}>
                {selectedIds.has(row.id) && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-text-primary">{row.monthYear}</h3>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] font-bold text-text-muted">Base: {formatCurrency(row.amount)}</span>
                  {row.lateCharge > 0 && (
                    <span className="text-[10px] font-bold text-warning">+ Late: {formatCurrency(row.lateCharge)}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-text-primary">
                  {formatCurrency(row.amount + row.lateCharge + row.gst)}
                </span>
                <p className="text-[9px] font-black text-text-muted uppercase mt-0.5">DUE</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-xl font-black text-text-primary">Property Cleared</h3>
            <p className="text-sm text-text-muted mt-2 px-4">
              No pending maintenance for {activePlot?.plotNo}. You are all caught up!
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-10 left-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-primary-dark rounded-[28px] p-6 shadow-2xl flex items-center justify-between border border-white/10">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                {selectedIds.size} ITEM{selectedIds.size > 1 ? 'S' : ''} SELECTED
              </p>
              <p className="text-2xl font-black text-white">{formatCurrency(totalAmount)}</p>
            </div>
            <Button
              className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 px-8 font-black text-base shadow-xl"
              onClick={() => {}}
            >
              Pay Dues
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
