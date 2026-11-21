'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, UtensilsCrossed, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { defaultTables } from '@/lib/store';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { totalItemCount, tableNumber, setTableNumber, lastPlacedOrder } = useCart();
  const [showTableSelect, setShowTableSelect] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-coffee-200/40 bg-cream-100/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-amberGold/30 bg-coffee-950 shadow-md transition-transform group-hover:scale-105">
            <Image
              src="/images/cafe/logo_3d.jpeg"
              alt="The Shawarma Palace Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-coffee-950 sm:text-xl">
                The Shawarma Palace
              </span>
              <span className="hidden rounded bg-amberGold/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amberGold-hover sm:inline-block">
                Cafe
              </span>
            </div>
            <p className="text-[11px] font-medium text-coffee-600 hidden sm:block">
              Fresh & Delicious • Smart Dine-In
            </p>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Table Number Badge with Quick Switch */}
          <div className="relative">
            <button
              onClick={() => setShowTableSelect(!showTableSelect)}
              className="flex items-center gap-1.5 rounded-full border border-coffee-300/60 bg-coffee-50 px-3 py-1.5 text-xs font-semibold text-coffee-900 shadow-sm transition hover:bg-coffee-100 hover:border-coffee-400"
              title="Click to switch dining table"
            >
              <UtensilsCrossed className="h-3.5 w-3.5 text-amberGold" />
              <span>Table {tableNumber || 'T01'}</span>
              <span className="text-[9px] text-coffee-500 font-normal ml-0.5">▾</span>
            </button>

            {/* Table Dropdown */}
            {showTableSelect && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-coffee-200 bg-white p-2 shadow-premium z-50">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-coffee-500">
                  Select Your Table
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1 max-h-48 overflow-y-auto">
                  {defaultTables.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTableNumber(t.table_number);
                        setShowTableSelect(false);
                      }}
                      className={`rounded-lg px-2 py-1.5 text-xs font-medium text-left transition ${
                        tableNumber === t.table_number
                          ? 'bg-coffee-900 text-cream-100 font-bold'
                          : 'hover:bg-coffee-50 text-coffee-800'
                      }`}
                    >
                      {t.table_number} ({t.capacity}P)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Menu Link */}
          <Link
            href="/menu"
            className="hidden items-center gap-1 text-xs font-semibold text-coffee-800 hover:text-amberGold transition md:flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-amberGold" />
            <span>Digital Menu</span>
          </Link>

          {/* Order Tracking Link (If active order exists) */}
          {lastPlacedOrder && (
            <Link
              href={`/track-order?orderId=${lastPlacedOrder.id}`}
              className="flex items-center gap-1.5 rounded-full bg-amberGold/15 px-3 py-1.5 text-xs font-bold text-amberGold-hover hover:bg-amberGold/25 transition animate-pulse"
              title="Track your active dining order"
            >
              <Clock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Track</span> {lastPlacedOrder.id}
            </Link>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="relative flex items-center justify-center rounded-xl bg-coffee-950 p-2.5 text-cream-100 shadow-md transition hover:bg-coffee-900 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-5 w-5 text-cream-100" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amberGold text-[11px] font-bold text-white shadow-sm animate-bounce">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Manager Dashboard Direct Link */}
          <Link
            href="/manager/dashboard"
            className="hidden sm:flex items-center gap-1 rounded-lg border border-coffee-300/50 px-2.5 py-1.5 text-xs font-medium text-coffee-700 hover:bg-coffee-100 hover:text-coffee-950 transition"
            title="Cafe Manager Portal"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-coffee-500" />
            <span>Manager</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
