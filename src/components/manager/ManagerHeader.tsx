'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  LogOut, 
  Store, 
  ExternalLink,
  Shield, 
  Sparkles
} from 'lucide-react';
import { useManagerAuth } from '@/context/ManagerAuthContext';
import { soundManager } from '@/lib/sound';
import { defaultCafe } from '@/lib/store';

interface ManagerHeaderProps {
  pendingCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({
  pendingCount,
  activeTab,
  setActiveTab,
}) => {
  const { user, logout } = useManagerAuth();
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playStatusChangeBeep();
  };

  const navItems = [
    { key: 'orders', label: 'Live Orders', badge: pendingCount > 0 ? pendingCount : undefined },
    { key: 'menu', label: 'Menu Catalog' },
    { key: 'tables', label: 'QR & Tables' },
    { key: 'reports', label: 'Sales & Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-coffee-800 bg-coffee-950 text-cream-100 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand & Cafe Name */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-amberGold/40 bg-coffee-900 shadow">
            <Image
              src="/images/cafe/logo_3d.jpeg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-cream-50 sm:text-lg">
                {defaultCafe.name}
              </span>
              <span className="rounded bg-amberGold/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amberGold/30">
                HQ Dashboard
              </span>
            </div>
            <p className="text-[11px] text-coffee-300 hidden sm:block">
              Multi-Cafe Smart Management Suite
            </p>
          </div>
        </div>

        {/* Tab Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-coffee-900/80 p-1 border border-coffee-800">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amberGold text-white shadow-sm'
                    : 'text-coffee-300 hover:text-cream-100 hover:bg-coffee-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Chime Notification Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              soundEnabled
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40'
                : 'border-coffee-700 bg-coffee-900 text-coffee-400 hover:text-coffee-200'
            }`}
            title={soundEnabled ? 'Order sound alerts enabled (Click to mute)' : 'Order sound alerts muted (Click to enable)'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400 animate-bounce" />
                <span className="hidden sm:inline">Chime ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                <span className="hidden sm:inline">Chime OFF</span>
              </>
            )}
          </button>

          {/* Customer Menu Live Preview Link */}
          <Link
            href="/menu?cafe=cafe001&table=T01"
            target="_blank"
            className="hidden sm:flex items-center gap-1 rounded-xl border border-coffee-700 bg-coffee-900 px-3 py-1.5 text-xs font-semibold text-coffee-200 hover:bg-coffee-800 transition"
            title="Open customer ordering view in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5 text-amberGold" />
            <span>Customer View</span>
          </Link>

          {/* User & Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl bg-coffee-900 border border-coffee-800 p-2 text-coffee-300 hover:text-red-400 hover:bg-coffee-800 transition"
            title="Sign out of manager session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden overflow-x-auto border-t border-coffee-800 bg-coffee-900/90 px-2 py-1.5 gap-1 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-amberGold text-white'
                  : 'text-coffee-300 hover:bg-coffee-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
