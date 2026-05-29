'use client';

import React from 'react';

export const HomeTopBar: React.FC<{
  userName?: string;
  onMenuPress: () => void;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}> = ({ userName, onMenuPress, onNotificationPress, onProfilePress }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-primary-dark">
      <button onClick={onMenuPress} className="text-2xl text-white">☰</button>
      <div className="flex items-center gap-4">
        <button onClick={onNotificationPress} className="text-xl text-white">🔔</button>
        <button onClick={onProfilePress} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-white/20 overflow-hidden">
          <span className="text-lg">👤</span>
        </button>
      </div>
    </div>
  );
};

export const HomeHero: React.FC<{
  userName?: string;
  societyName?: string;
  plotName?: string;
}> = ({ userName, societyName, plotName }) => {
  return (
    <div className="bg-primary-dark px-6 pb-8 pt-2">
      <p className="text-white/60 text-sm font-medium">Good Morning,</p>
      <h2 className="text-white text-3xl font-black tracking-tight mt-1">{userName || 'Resident'}</h2>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm">📍</span>
        <p className="text-white/80 text-sm font-semibold truncate">
          {societyName || 'Home Orbit Society'} • {plotName || 'Plot linked'}
        </p>
      </div>
    </div>
  );
};
