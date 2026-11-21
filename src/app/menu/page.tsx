'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  UtensilsCrossed, 
  ShoppingBag, 
  ArrowLeft, 
  Flame, 
  Clock, 
  Filter, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CategorySlider } from '@/components/customer/CategorySlider';
import { MenuItemCard } from '@/components/customer/MenuItemCard';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { useCart } from '@/context/CartContext';
import { defaultCafe, defaultCategories, dataStore } from '@/lib/store';
import { IMenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

function MenuContent() {
  const searchParams = useSearchParams();
  const { tableNumber, setTableNumber, setCafeId, totalItemCount, totalAmount } = useCart();

  const [items, setItems] = useState<IMenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync URL parameters
  useEffect(() => {
    const cafeParam = searchParams.get('cafe');
    const tableParam = searchParams.get('table');

    if (cafeParam) setCafeId(cafeParam);
    if (tableParam) setTableNumber(tableParam.toUpperCase());

    const targetCafe = cafeParam || 'cafe001';
    
    // Load menu from shared API so changes made by manager reflect for customers
    fetch(`/api/menu?cafe=${targetCafe}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.items && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems(dataStore.getMenuItems(targetCafe));
        }
      })
      .catch(() => {
        setItems(dataStore.getMenuItems(targetCafe));
      });
  }, [searchParams]);

  // Filter items based on Category, Search & Dietary
  const filteredItems = items.filter((it) => {
    const matchesCat = activeCategory === 'all' || it.category_id === activeCategory;
    const matchesSearch =
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet =
      dietaryFilter === 'all'
        ? true
        : dietaryFilter === 'veg'
        ? it.is_veg === true
        : it.is_veg === false;

    return matchesCat && matchesSearch && matchesDiet;
  });

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-coffee-950">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 pb-24">
        {/* WELCOME BANNER (Identifying Cafe ID & Table Number) */}
        <div className="border-b border-coffee-200/60 bg-gradient-to-r from-coffee-950 via-coffee-900 to-coffee-950 text-cream-100 py-6 px-4">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amberGold px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow">
                  Table {tableNumber || 'T01'}
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  Cafe ID: cafe001
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-cream-50 pt-1">
                Welcome to {defaultCafe.name}
              </h1>
              <p className="text-xs sm:text-sm text-coffee-200">
                Enjoy your dining experience! Select your favorite dishes and order directly to your table.
              </p>
            </div>

            {/* Quick Cart Trigger Pill */}
            {totalItemCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-amberGold px-4 py-2.5 text-xs font-bold text-white hover:bg-amberGold-hover transition shadow"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{totalItemCount} Items • {formatCurrency(totalAmount)}</span>
              </button>
            )}
          </div>
        </div>

        {/* STICKY SEARCH & FILTER CONTROLS */}
        <div className="sticky top-[69px] z-30 border-b border-coffee-200/80 bg-cream-100/95 backdrop-blur-md py-3 shadow-xs">
          <div className="mx-auto max-w-7xl px-4 space-y-3">
            {/* Search and Dietary Switchers */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-coffee-400" />
                <input
                  type="text"
                  placeholder="Search shawarma, pizza, burgers, shakes, desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-coffee-300/80 bg-white pl-10 pr-4 py-2.5 text-xs text-coffee-950 placeholder:text-coffee-400 focus:border-amberGold focus:outline-none shadow-sm"
                />
              </div>

              {/* Dietary Filter (All / Veg / Non-Veg) */}
              <div className="flex items-center rounded-2xl border border-coffee-300/80 bg-white p-1 shadow-sm shrink-0">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    dietaryFilter === 'all'
                      ? 'bg-coffee-950 text-cream-100'
                      : 'text-coffee-700 hover:text-coffee-950'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    dietaryFilter === 'veg'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Veg Only</span>
                </button>
                <button
                  onClick={() => setDietaryFilter('non-veg')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    dietaryFilter === 'non-veg'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-red-800 hover:bg-red-50'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>

            {/* Category Slider (Starters, Main, Pizza, Burgers, Sandwiches, Pasta, Beverages, Desserts) */}
            <CategorySlider
              categories={defaultCategories}
              activeCategoryId={activeCategory}
              onSelectCategory={(id) => setActiveCategory(id)}
            />
          </div>
        </div>

        {/* MENU ITEMS GRID */}
        <div className="mx-auto max-w-7xl px-4 pt-6">
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-coffee-300 bg-white p-12 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coffee-100 text-coffee-400">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-coffee-900">
                No matching dishes found
              </h3>
              <p className="text-xs text-coffee-500 max-w-xs mx-auto">
                Try selecting "All" categories or clearing your search term to see more delicious options.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setDietaryFilter('all');
                }}
                className="rounded-xl bg-coffee-950 px-4 py-2 text-xs font-bold text-cream-100 hover:bg-amberGold transition"
              >
                Reset Menu Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Count Header */}
              <div className="flex items-center justify-between text-xs text-coffee-600 font-semibold border-b border-coffee-200/50 pb-2">
                <span>Showing {filteredItems.length} delicious {filteredItems.length === 1 ? 'dish' : 'dishes'}</span>
                <span className="text-coffee-500">Table {tableNumber || 'T01'}</span>
              </div>

              {/* Grid of Dishes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLOATING STICKY BOTTOM CART BAR */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between rounded-2xl border border-amberGold/40 bg-coffee-950 p-3.5 text-cream-100 shadow-elevated">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amberGold text-white font-extrabold text-sm shadow">
                {totalItemCount}
              </div>
              <div>
                <p className="text-xs font-bold text-cream-50">
                  {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'} Selected
                </p>
                <p className="text-xs font-extrabold text-amberGold">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amberGold px-5 py-2.5 text-xs font-bold text-white hover:bg-amberGold-hover shadow transition active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Review & Place Order</span>
            </button>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Footer />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-coffee-600">Loading Cafe Menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
