'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background-custom pb-12">
      <div className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-2xl text-text-primary p-2 -ml-2">
          ←
        </button>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Notifications</h1>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex justify-between items-center px-1 mb-2">
          <h2 className="text-[11px] font-black text-text-muted uppercase tracking-widest">RECENT UPDATES</h2>
          <button className="text-[10px] font-bold text-primary tracking-wider uppercase">Mark all read</button>
        </div>

        {[
          { 
            title: 'Maintenance Due', 
            desc: 'Maintenance for Jan 2025 is pending. Please complete the payment to avoid late fees.', 
            time: '2h ago',
            icon: '💸',
            color: 'bg-error/5 text-error',
            isNew: true
          },
          { 
            title: 'Meeting Notice', 
            desc: 'The Society AGM is scheduled for Feb 10th at 10:00 AM in the clubhouse.', 
            time: '1d ago',
            icon: '📢',
            color: 'bg-primary/5 text-primary',
            isNew: false
          },
          { 
            title: 'Water Supply Update', 
            desc: 'Regular water supply will be interrupted tomorrow between 2 PM and 4 PM due to tank cleaning.', 
            time: '2d ago',
            icon: '💧',
            color: 'bg-info/5 text-info',
            isNew: false
          }
        ].map((notif, i) => (
          <Card key={i} className={`flex gap-4 p-5 border-border bg-white shadow-sm relative overflow-hidden ${notif.isNew ? 'border-l-4 border-l-primary' : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
              <span className="text-2xl">{notif.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-black text-text-primary truncate">{notif.title}</h3>
                <span className="text-[10px] font-bold text-text-muted">{notif.time}</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2 font-medium">
                {notif.desc}
              </p>
            </div>
          </Card>
        ))}

        <div className="bg-white/50 rounded-3xl p-12 text-center border-2 border-dashed border-divider">
          <p className="text-xs font-bold text-text-muted">You've reached the end of your notifications.</p>
        </div>
      </div>
    </div>
  );
}
