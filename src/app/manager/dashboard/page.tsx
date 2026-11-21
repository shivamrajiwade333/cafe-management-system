'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Clock, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Plus, 
  ExternalLink,
  Store,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useManagerAuth } from '@/context/ManagerAuthContext';
import { ManagerHeader } from '@/components/manager/ManagerHeader';
import { LiveOrdersTab } from '@/components/manager/LiveOrdersTab';
import { MenuManagementTab } from '@/components/manager/MenuManagementTab';
import { QRCodeManagementTab } from '@/components/manager/QRCodeManagementTab';
import { ReportsTab } from '@/components/manager/ReportsTab';
import { dataStore, defaultCafe } from '@/lib/store';
import { ISalesReport, IOrder } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function ManagerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useManagerAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'tables' | 'reports'>('orders');
  const [report, setReport] = useState<ISalesReport | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Auth Protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/manager/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const refreshOverview = () => {
    const data = dataStore.getSalesReport('cafe001');
    setReport(data);
    const orders = dataStore.getOrders('cafe001');
    setPendingCount(orders.filter((o) => o.status === 'pending').length);
  };

  useEffect(() => {
    refreshOverview();

    const unsubscribe = dataStore.subscribe((event) => {
      if (event.type === 'NEW_ORDER' || event.type === 'ORDER_STATUS_CHANGED') {
        refreshOverview();
      }
    });

    const interval = setInterval(refreshOverview, 5000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coffee-950 text-cream-100">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amberGold border-t-transparent" />
          <p className="text-xs text-coffee-300">Checking manager authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 text-coffee-950 flex flex-col">
      {/* SaaS Top Header */}
      <ManagerHeader
        pendingCount={pendingCount}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        
        {/* DASHBOARD TOP KPI OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Total Orders Today */}
          <div className="rounded-2xl border border-coffee-200/80 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-coffee-500">
              <span>Orders Today</span>
              <ShoppingBag className="h-4 w-4 text-coffee-600" />
            </div>
            <p className="font-serif text-2xl font-extrabold text-coffee-950 mt-1">
              {report?.today_orders ?? 12}
            </p>
            <p className="text-[10px] text-coffee-400 mt-0.5">Tables served today</p>
          </div>

          {/* Pending Orders */}
          <div
            onClick={() => setActiveTab('orders')}
            className={`cursor-pointer rounded-2xl border p-4 shadow-soft transition-all hover:scale-102 ${
              (report?.pending_orders ?? 0) > 0
                ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-300'
                : 'border-coffee-200/80 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-800">
              <span>Pending Action</span>
              <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            </div>
            <p className="font-serif text-2xl font-extrabold text-amber-900 mt-1">
              {report?.pending_orders ?? 0}
            </p>
            <p className="text-[10px] text-amber-700 mt-0.5 font-medium">Needs manager accept</p>
          </div>

          {/* Preparing Orders */}
          <div
            onClick={() => setActiveTab('orders')}
            className="cursor-pointer rounded-2xl border border-coffee-200/80 bg-white p-4 shadow-soft transition-all hover:scale-102"
          >
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-orange-700">
              <span>In Kitchen</span>
              <Flame className="h-4 w-4 text-orange-600" />
            </div>
            <p className="font-serif text-2xl font-extrabold text-orange-950 mt-1">
              {report?.preparing_orders ?? 0}
            </p>
            <p className="text-[10px] text-coffee-400 mt-0.5">Cooking on fire</p>
          </div>

          {/* Completed Orders */}
          <div className="rounded-2xl border border-coffee-200/80 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              <span>Served Done</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl font-extrabold text-emerald-950 mt-1">
              {report?.completed_orders ?? 0}
            </p>
            <p className="text-[10px] text-coffee-400 mt-0.5">Delivered to tables</p>
          </div>

          {/* Total Sales Today */}
          <div className="col-span-2 md:col-span-1 rounded-2xl border border-coffee-200/80 bg-gradient-to-br from-coffee-950 to-coffee-900 p-4 shadow-soft text-cream-100">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <span>Today's Sales</span>
              <TrendingUp className="h-4 w-4 text-amberGold" />
            </div>
            <p className="font-serif text-2xl font-extrabold text-cream-50 mt-1">
              {formatCurrency(report?.today_sales ?? 4280)}
            </p>
            <p className="text-[10px] text-coffee-300 mt-0.5">Gross revenue</p>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="pt-2">
          {activeTab === 'orders' && (
            <LiveOrdersTab onUpdatePendingCount={(c) => setPendingCount(c)} />
          )}

          {activeTab === 'menu' && <MenuManagementTab />}

          {activeTab === 'tables' && <QRCodeManagementTab />}

          {activeTab === 'reports' && <ReportsTab />}
        </div>
      </main>
    </div>
  );
}
