'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { getDashboard } from '@/services/societyApi';
import { HomeTopBar, HomeHero } from '@/components/home/HomeHeader';
import { DashboardStats } from '@/components/home/DashboardStats';
import { SocietyFundCard } from '@/components/home/SocietyFundCard';

export default function HomePage() {
  const router = useRouter();
  const { activeProfile, user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeProfile) {
      const fetchDashboard = async () => {
        setLoading(true);
        const data = await getDashboard(activeProfile);
        setDashboard(data);
        setLoading(false);
      };
      fetchDashboard();
    }
  }, [activeProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-custom flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-text-muted font-bold text-sm">Syncing Society Data...</p>
      </div>
    );
  }

  const activePlot = dashboard?.plots?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-background-custom pb-24">
      <HomeTopBar 
        userName={user?.name}
        onMenuPress={() => {}}
        onNotificationPress={() => router.push('/notifications')}
        onProfilePress={() => router.push('/profile')}
      />

      <HomeHero 
        userName={user?.name}
        societyName={activeProfile?.societyName}
        plotName={activePlot?.plotNo}
      />

      <div className="px-6 space-y-6">
        <DashboardStats 
          plot={activePlot}
          onPayPress={() => router.push('/maintenance')}
          onHistoryPress={() => router.push('/history')}
        />

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Pay', icon: '💸' },
            { label: 'Dues', icon: '📝' },
            { label: 'Rules', icon: '📜' },
            { label: 'Staff', icon: '👮' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-white rounded-2xl border border-border flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                <span className="text-xl">{action.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>

        <SocietyFundCard 
          fund={dashboard?.societyFund}
          onPress={() => router.push('/society/fund')}
        />

        {/* Announcements Placeholder */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">ANNOUNCEMENTS</h3>
            <button className="text-[10px] font-bold text-primary tracking-wider uppercase">See All</button>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border flex items-center gap-4">
            <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center shrink-0">
              <span className="text-xl">📢</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-text-primary">Society Annual General Meeting</h4>
              <p className="text-xs text-text-muted mt-0.5">Scheduled for next Sunday at 10 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
