'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getSociety } from '@/services/societyApi';

interface Society {
  id: string;
  name: string;
  city: string;
  plots: number;
}

export default function SocietyPage() {
  const router = useRouter();
  const { user, updateActiveProfile } = useAuth();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Society[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Society | null>(null);

  const myProfiles = user?.ownerProfiles || [];

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await getSociety(query);
      setResults(res);
      setSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleJoin = async (profile?: any) => {
    const target = profile || selected;
    if (!target) return;

    await updateActiveProfile(target);
    router.push('/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-dark">
      <div className="px-6 pt-12 pb-10 text-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">🏢</span>
        </div>
        <h1 className="text-white text-3xl font-black tracking-tight">Your Societies</h1>
        <p className="text-white/70 text-sm mt-2 px-8">Select an existing property or find a new one.</p>
      </div>

      <div className="flex-1 bg-background-custom rounded-t-[40px] px-6 pt-8 pb-12 space-y-8 overflow-y-auto">
        {/* My Societies */}
        {myProfiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] ml-1">
              REGISTERED PROPERTIES
            </h2>
            {myProfiles.map((p: any, i: number) => (
              <Card 
                key={i} 
                onClick={() => handleJoin(p)}
                className="flex items-center gap-4 hover:border-primary transition-all group"
              >
                <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center shrink-0">
                  <span className="text-xl">🏠</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-primary font-bold truncate">{p.societyName}</h3>
                  <p className="text-text-muted text-xs truncate">
                    {p.ownerName} • {p.unitOwner?.[0]?.unitName || 'Plot linked'}
                  </p>
                  <div className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider mt-2
                    ${p.isApprovedByAdmin ? 'bg-success-light text-success' : 'bg-warning/10 text-warning'}
                  `}>
                    {p.isApprovedByAdmin ? 'VERIFIED' : 'PENDING APPROVAL'}
                  </div>
                </div>
                <span className="text-2xl text-divider group-hover:text-primary transition-colors">›</span>
              </Card>
            ))}

            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-divider" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">OR FIND OTHERS</span>
              <div className="flex-1 h-px bg-divider" />
            </div>
          </div>
        )}

        {/* Search */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-lg">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search society name..."
              className="w-full h-16 bg-white border border-border rounded-2xl pl-12 pr-4 font-bold text-text-primary placeholder:text-text-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            />
            {searching && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {results.length > 0 && !selected && (
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {results.map((s: Society, i: number) => (
                <button
                  key={i}
                  onClick={() => { setSelected(s); setQuery(s.name); setResults([]); }}
                  className={`w-full flex items-center gap-4 p-4 text-left hover:bg-surface-alt transition-colors
                    ${i < results.length - 1 ? 'border-bottom border-divider' : ''}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-primary truncate">{s.name}</h4>
                    <p className="text-xs text-text-muted">{s.city} • {s.plots} Plots</p>
                  </div>
                  <span className="text-xl text-divider">›</span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-11 h-11 bg-white shadow-sm rounded-xl flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-text-primary truncate">{selected.name}</h4>
                <p className="text-xs text-text-muted">{selected.city}</p>
              </div>
              <button onClick={() => { setSelected(null); setQuery(''); }} className="text-text-muted text-xl p-2 hover:text-text-primary">
                ✕
              </button>
            </div>
          )}

          <Button
            className="w-full h-16 rounded-2xl text-lg font-bold"
            disabled={!selected}
            onClick={() => handleJoin()}
          >
            Go to Dashboard
          </Button>
        </div>

        <p className="text-center text-[11px] text-text-muted px-8 leading-relaxed opacity-60">
          Property and dues information will be synced from society records.
        </p>
      </div>
    </div>
  );
}
