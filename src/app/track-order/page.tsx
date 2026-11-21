'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { OrderStatusTracker } from '@/components/customer/OrderStatusTracker';
import { useCart } from '@/context/CartContext';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { lastPlacedOrder } = useCart();

  const orderId = searchParams.get('orderId') || lastPlacedOrder?.id || 'ORD-1042';

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-coffee-950">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-2xl px-4 text-center space-y-2 mb-4">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-300">
            Live Order Tracking
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-coffee-950">
            Kitchen Progress & Status
          </h1>
          <p className="text-xs text-coffee-600">
            Your dining order updates automatically without page refreshing.
          </p>
        </div>

        <OrderStatusTracker orderId={orderId} />
      </main>
      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-coffee-600">Loading Order Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
