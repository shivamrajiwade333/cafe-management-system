'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Utensils, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft, 
  PhoneCall,
  RefreshCw
} from 'lucide-react';
import { IOrder, OrderStatus } from '@/types';
import { dataStore, defaultCafe } from '@/lib/store';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import { VegBadge } from '@/components/common/VegBadge';
import { soundManager } from '@/lib/sound';

interface OrderStatusTrackerProps {
  orderId: string;
}

const statusSteps: { key: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { key: 'pending', label: 'Order Received', desc: 'Received at reception', icon: Clock },
  { key: 'accepted', label: 'Order Accepted', desc: 'Manager confirmed ticket', icon: CheckCircle2 },
  { key: 'preparing', label: 'Chef Preparing', desc: 'Cooking fresh in kitchen', icon: Flame },
  { key: 'ready', label: 'Food Ready', desc: 'Plated & ready for serving', icon: Sparkles },
  { key: 'served', label: 'Served at Table', desc: 'Enjoy your meal!', icon: Utensils },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ orderId }) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOrder = () => {
    const found = dataStore.getOrderById(orderId);
    if (found) {
      setOrder({ ...found });
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchOrder();

    // Subscribe to real-time events from dataStore broadcast
    const unsubscribe = dataStore.subscribe((event) => {
      if (
        (event.type === 'ORDER_STATUS_CHANGED' || event.type === 'NEW_ORDER') &&
        (event.payload as IOrder)?.id === orderId
      ) {
        soundManager.playStatusChangeBeep();
        setOrder({ ...(event.payload as IOrder) });
        setLastUpdated(new Date());
      }
    });

    // Also poll gently every 5s as safety fallback
    const interval = setInterval(fetchOrder, 5000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [orderId]);

  if (!order) {
    return (
      <div className="mx-auto max-w-md p-8 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coffee-100 text-coffee-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-coffee-950">
          Looking up Order {orderId}...
        </h3>
        <p className="text-xs text-coffee-500">
          Checking kitchen records. If your order was recently placed, it will appear here momentarily.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-xl bg-coffee-950 px-5 py-2.5 text-xs font-bold text-cream-100 hover:bg-amberGold transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'served': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Back to Menu */}
      <div className="flex items-center justify-between">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-700 hover:text-amberGold transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Menu</span>
        </Link>

        <button
          onClick={fetchOrder}
          className="inline-flex items-center gap-1 rounded-lg border border-coffee-200 bg-white px-2.5 py-1 text-xs text-coffee-600 hover:bg-coffee-50"
          title="Refresh status"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Sync</span>
        </button>
      </div>

      {/* Main Status Hero Card */}
      <div className="overflow-hidden rounded-3xl border border-coffee-200/80 bg-white shadow-premium">
        {/* Banner */}
        <div className="bg-gradient-to-r from-coffee-950 via-coffee-900 to-coffee-950 p-6 text-cream-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amberGold/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 border border-amberGold/30">
                Table {order.table_number}
              </span>
              <span className="text-xs text-coffee-300">
                Placed {formatTimeAgo(order.created_at)}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-cream-50">
              Order {order.id}
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-coffee-300">Total Bill</span>
            <p className="text-xl font-extrabold text-amberGold">
              {formatCurrency(order.total_amount)}
            </p>
          </div>
        </div>

        {/* Live Status Progress Bar */}
        <div className="p-6">
          {isCancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center space-y-2">
              <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
              <h4 className="font-serif text-lg font-bold text-red-950">
                Order Cancelled
              </h4>
              <p className="text-xs text-red-700">
                This order was cancelled by the manager. Please speak with cafe staff if you have any questions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amberGold">
                    Live Kitchen Status
                  </span>
                  <h3 className="font-serif text-xl font-bold text-coffee-950">
                    {order.status === 'pending' && 'Order Received at Desk'}
                    {order.status === 'accepted' && 'Order Accepted by Manager'}
                    {order.status === 'preparing' && 'Chef is Preparing Your Food 🔥'}
                    {order.status === 'ready' && 'Your Dishes Are Ready! 🍽️'}
                    {order.status === 'served' && 'Order Served! Enjoy your Meal 🎉'}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-Time Sync</span>
                </div>
              </div>

              {/* Step Flow */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-5 right-5 h-1 bg-coffee-100 -z-0 hidden sm:block">
                  <div
                    className="h-full bg-gradient-to-r from-amberGold to-emerald-600 transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(0, (currentStep / (statusSteps.length - 1)) * 100))}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {statusSteps.map((step, idx) => {
                    const isDone = currentStep > idx;
                    const isCurrent = currentStep === idx;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`flex sm:flex-col items-center gap-3 sm:gap-2 p-2 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-amberGold/10 border border-amberGold/30 scale-[1.02]'
                            : isDone
                            ? 'opacity-90'
                            : 'opacity-40'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm z-10 transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amberGold text-white ring-4 ring-amberGold/20 animate-pulse'
                              : 'bg-coffee-200 text-coffee-600'
                          }`}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <div className="text-left sm:text-center min-w-0">
                          <p className={`text-xs font-bold truncate ${isCurrent ? 'text-amberGold-hover' : 'text-coffee-950'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-coffee-500 sm:line-clamp-1">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Order Summary */}
      <div className="rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-4">
        <h4 className="font-serif text-base font-bold text-coffee-950 border-b border-coffee-100 pb-2">
          Ordered Dishes
        </h4>

        <div className="divide-y divide-coffee-100">
          {order.items.map((it) => (
            <div key={it.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <VegBadge isVeg={it.is_veg} size="sm" />
                <div>
                  <p className="text-xs font-bold text-coffee-950">
                    {it.item_name}
                  </p>
                  <p className="text-[11px] text-coffee-500">
                    {it.quantity} x {formatCurrency(it.item_price)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-coffee-950">
                {formatCurrency(it.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {order.special_instructions && (
          <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-900 space-y-0.5">
            <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700">Special Instructions:</span>
            <p className="italic font-medium">"{order.special_instructions}"</p>
          </div>
        )}

        <div className="border-t border-coffee-200 pt-3 space-y-1.5 text-xs text-coffee-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-coffee-500">
            <span>Restaurant GST (5%)</span>
            <span>{formatCurrency(order.tax_amount)}</span>
          </div>
          <div className="flex justify-between border-t border-coffee-200 pt-2 text-sm font-bold text-coffee-950">
            <span>Total Payable</span>
            <span className="text-amberGold text-base font-extrabold">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Assistance Card */}
      <div className="rounded-2xl border border-coffee-200 bg-coffee-50 p-4 flex items-center justify-between text-xs text-coffee-700">
        <div>
          <p className="font-bold text-coffee-900">Need table assistance?</p>
          <p className="text-[11px] text-coffee-500">Waiters are available on the floor.</p>
        </div>
        <a
          href={`tel:${defaultCafe.phone}`}
          className="flex items-center gap-1.5 rounded-lg bg-coffee-950 px-3 py-1.5 font-bold text-cream-100 hover:bg-amberGold transition"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>Call Desk</span>
        </a>
      </div>
    </div>
  );
};
