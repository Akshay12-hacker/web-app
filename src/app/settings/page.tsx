'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background-custom pb-12">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-muted text-sm mt-2 font-medium">Manage your app preferences and support options.</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Display */}
        <Card className="p-0 border-border bg-white shadow-xl overflow-hidden">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            Display
          </h2>
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Dark Mode</h3>
              <p className="text-[11px] text-text-muted font-medium">Enjoy a darker color scheme</p>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-divider'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-0 border-border bg-white shadow-xl overflow-hidden">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            Preferences
          </h2>
          <div className="divide-y divide-divider">
            <ActionRow title="Notifications" subtitle="Manage push notifications" icon="🔔" />
            <ActionRow title="Payment Reminders" subtitle="Enable or disable reminders" icon="💸" />
            <ActionRow title="Language" subtitle="English" icon="🌐" last />
          </div>
        </Card>

        {/* Support */}
        <Card className="p-0 border-border bg-white shadow-xl overflow-hidden">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            Support
          </h2>
          <div className="divide-y divide-divider">
            <ActionRow title="Help Center" subtitle="Get support and help" icon="❓" />
            <ActionRow title="Privacy Policy" subtitle="Read our privacy policy" icon="🔒" />
            <ActionRow title="Terms & Conditions" subtitle="View terms and conditions" icon="📄" last />
          </div>
        </Card>

        {/* About */}
        <Card className="p-0 border-border bg-white shadow-xl overflow-hidden">
          <h2 className="text-sm font-black text-text-primary px-6 py-4 border-b border-divider">
            About
          </h2>
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center text-xl">
                📱
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">App Version</h3>
                <p className="text-[11px] text-text-muted font-medium">HomeOrbit Web v1.0.0</p>
              </div>
            </div>
            <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">
              Latest
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ActionRow({ title, subtitle, icon, last }: { title: string; subtitle: string; icon: string; last?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-surface-alt transition-colors ${last ? '' : 'border-b border-divider'}`}>
      <div className="w-11 h-11 bg-surface-alt rounded-xl flex items-center justify-center shrink-0">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
        <p className="text-[11px] text-text-muted font-medium truncate">{subtitle}</p>
      </div>
      <span className="text-xl text-divider">›</span>
    </button>
  );
}
