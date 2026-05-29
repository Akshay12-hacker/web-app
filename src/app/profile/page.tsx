'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, activeProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = activeProfile?.ownerName || activeProfile?.OwnerName || user?.name || 'Resident';
  const displayPhone = user?.phone || activeProfile?.ownerPhone || '-';

  return (
    <div className="flex flex-col min-h-screen bg-background-custom pb-12">
      {/* Profile Header */}
      <div className="bg-primary-dark pt-12 pb-16 px-6 rounded-b-[40px] shadow-lg text-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full border-4 border-white/10 flex items-center justify-center mx-auto mb-4 overflow-hidden relative shadow-2xl">
          <span className="text-5xl">👤</span>
        </div>
        <h1 className="text-white text-2xl font-black tracking-tight">{displayName}</h1>
        <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white/70 uppercase tracking-widest mt-2 border border-white/5">
          {activeProfile?.role || 'RESIDENT'}
        </div>
        <p className="text-white/60 text-xs font-bold mt-4 tracking-wide uppercase">
          {activeProfile?.societyName || 'Home Orbit Society'}
        </p>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Personal Info */}
        <Card className="p-0 border-border bg-white shadow-xl">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            Personal Information
          </h2>
          <div className="divide-y divide-divider">
            <InfoRow label="Phone" value={displayPhone} icon="📱" />
            <InfoRow label="Email" value={user?.email || 'Not Added'} icon="📧" />
            <InfoRow label="Plot" value={activeProfile?.unitOwner?.[0]?.unitName || 'No Plot'} icon="🏠" />
            <InfoRow label="Member Since" value="2024" icon="📅" last />
          </div>
        </Card>

        {/* Society Info */}
        <Card className="p-0 border-border bg-white shadow-xl">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            Society Membership
          </h2>
          <div className="divide-y divide-divider">
            <InfoRow label="Society" value={activeProfile?.societyName || 'Unknown'} icon="🏢" />
            <InfoRow label="Wing" value={activeProfile?.unitOwner?.[0]?.wingName || '-'} icon="🏗️" />
            <InfoRow label="Resident Type" value={activeProfile?.residentType || 'Owner'} icon="🔑" last />
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-0 border-border bg-white shadow-xl overflow-hidden">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            Account Actions
          </h2>
          <div className="divide-y divide-divider">
            <ActionRow title="Edit Profile" subtitle="Update your account information" icon="✏️" />
            <ActionRow title="Manage Subscription" subtitle="View or change your current plan" icon="💎" />
            <ActionRow title="Help & Support" subtitle="Get help regarding your account" icon="❓" />
            <ActionRow 
              title="Logout" 
              subtitle="Sign out from your account" 
              icon="🚪" 
              danger 
              last 
              onClick={handleLogout}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon, last }: { label: string; value: string; icon: string; last?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 ${last ? '' : 'border-b border-divider'}`}>
      <div className="w-10 h-10 bg-surface-alt rounded-xl flex items-center justify-center shrink-0">
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

function ActionRow({ title, subtitle, icon, danger, last, onClick }: { title: string; subtitle: string; icon: string; danger?: boolean; last?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-surface-alt transition-colors ${last ? '' : 'border-b border-divider'}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-error/5 text-error' : 'bg-primary/5 text-primary'}`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-bold ${danger ? 'text-error' : 'text-text-primary'}`}>{title}</h3>
        <p className="text-[11px] text-text-muted font-medium truncate">{subtitle}</p>
      </div>
      <span className="text-xl text-divider">›</span>
    </button>
  );
}
