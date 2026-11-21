'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  UtensilsCrossed, 
  Flame, 
  Award, 
  HeartHandshake, 
  QrCode, 
  Star, 
  Clock, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/customer/HeroSection';
import { PhotoGallery } from '@/components/customer/PhotoGallery';
import { CategorySlider } from '@/components/customer/CategorySlider';
import { MenuItemCard } from '@/components/customer/MenuItemCard';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { defaultCafe, defaultCategories, dataStore } from '@/lib/store';
import { IMenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const { totalItemCount, totalAmount, tableNumber } = useCart();

  useEffect(() => {
    const items = dataStore.getMenuItems('cafe001');
    setMenuItems(items);
  }, []);

  const popularDishes = menuItems.filter((i) => i.is_featured).slice(0, 6);
  const specialRecommendations = menuItems.filter((i) => i.tags?.includes('Palace Special') || i.tags?.includes('Signature Drink'));

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 text-coffee-950">
      {/* Navbar with Cart Trigger */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <HeroSection />

        {/* SECTION: WELCOME & ABOUT CAFE INTRODUCTION */}
        <section className="py-16 bg-white border-b border-coffee-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left: Founder & Cafe Interior Collage */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md">
                  {/* Founder photo */}
                  <div className="relative aspect-[4/5] w-4/5 overflow-hidden rounded-3xl border-2 border-amberGold/30 shadow-premium">
                    <Image
                      src="/images/cafe/founder.jpeg"
                      alt="Cafe Founder & Host"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-cream-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        Founder & Head Host
                      </span>
                      <p className="font-serif text-sm font-bold text-cream-50">
                        Passionate About Quality Flavors
                      </p>
                    </div>
                  </div>

                  {/* Overlapping Ambiance Card */}
                  <div className="absolute -bottom-6 -right-2 w-3/5 aspect-square overflow-hidden rounded-2xl border-4 border-white shadow-elevated bg-coffee-950">
                    <Image
                      src="/images/cafe/interior_main.jpeg"
                      alt="Cafe Lounge"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Story & Hospitality */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-amberGold/30 bg-coffee-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amberGold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>The Story Behind Our Craft</span>
                </div>

                <h2 className="font-serif text-3xl font-extrabold sm:text-4xl text-coffee-950 leading-tight">
                  A Modern Culinary Oasis Crafted for Food Lovers
                </h2>

                <p className="text-sm sm:text-base text-coffee-700 leading-relaxed">
                  Welcome to <strong>{defaultCafe.name}</strong>, where authentic Middle Eastern street-food artistry meets contemporary cafe culture. Founded with a mission to serve food made without compromises, we hand-marinate our tender meats for 24 hours, bake our sourdough fresh daily, and slow-steep our botanical drinks.
                </p>

                <p className="text-sm sm:text-base text-coffee-700 leading-relaxed">
                  Whether you're sitting in our plush booth lounges under the warm ambient wave lighting or catching up with close friends over a plate of hot peri-peri poppers, our QR ordering system ensures you spend less time waiting and more time enjoying.
                </p>

                {/* 3 Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  <div className="rounded-xl border border-coffee-200/80 bg-cream-50 p-4 space-y-1">
                    <Flame className="h-5 w-5 text-amberGold" />
                    <h4 className="font-serif text-sm font-bold text-coffee-950">Flame-Grilled</h4>
                    <p className="text-xs text-coffee-600">Slow-roasted on vertical spits with traditional spices.</p>
                  </div>

                  <div className="rounded-xl border border-coffee-200/80 bg-cream-50 p-4 space-y-1">
                    <UtensilsCrossed className="h-5 w-5 text-amberGold" />
                    <h4 className="font-serif text-sm font-bold text-coffee-950">Hand-Stretched</h4>
                    <p className="text-xs text-coffee-600">Napoli thin-crust pizzas & artisan sourdough melts.</p>
                  </div>

                  <div className="rounded-xl border border-coffee-200/80 bg-cream-50 p-4 space-y-1">
                    <Award className="h-5 w-5 text-amberGold" />
                    <h4 className="font-serif text-sm font-bold text-coffee-950">Pure Freshness</h4>
                    <p className="text-xs text-coffee-600">Zero artificial preservatives, 100% natural ingredients.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-coffee-950 px-6 py-3 text-xs font-bold text-cream-100 hover:bg-amberGold transition shadow"
                  >
                    <span>Explore Complete Menu</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION: POPULAR DISHES */}
        <section className="py-16 bg-cream-100/60 border-b border-coffee-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amberGold">
                  <Flame className="h-4 w-4" />
                  <span>Customer Favorites</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-coffee-950">
                  Most Popular Dishes
                </h2>
                <p className="text-xs sm:text-sm text-coffee-600">
                  The most ordered specialties loved by guests at Table {tableNumber || 'T01'}.
                </p>
              </div>

              <Link
                href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-900 hover:text-amberGold transition"
              >
                <span>View All 8 Categories</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Popular Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDishes.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: AUTHENTIC PHOTOGRAPHY GALLERY */}
        <PhotoGallery />

        {/* SECTION: SPECIAL RECOMMENDATIONS (CHEF'S PICKS) */}
        <section className="py-16 bg-coffee-950 text-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amberGold">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-cream-50">
                Special Recommendations from Our Head Chef
              </h2>
              <p className="text-xs sm:text-sm text-coffee-300">
                Handcrafted combinations and pairings guaranteed to delight your palate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Shawarma Platter Card */}
              <div className="rounded-2xl border border-amberGold/30 bg-coffee-900/80 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="relative h-44 w-full overflow-hidden rounded-xl border border-amberGold/20">
                    <Image
                      src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=800&auto=format&fit=crop"
                      alt="Palace Royal Shawarma Platter"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="rounded-md bg-amberGold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Signature Main
                  </span>
                  <h3 className="font-serif text-lg font-bold text-cream-50">
                    Palace Royal Chicken Shawarma Platter
                  </h3>
                  <p className="text-xs text-coffee-300 leading-relaxed">
                    24h spiced rotisserie chicken over saffron butter rice, garlic toum, spiced pickles & grilled pita.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-coffee-800">
                  <span className="text-base font-extrabold text-amberGold">₹369</span>
                  <Link
                    href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                    className="rounded-xl bg-amberGold px-4 py-1.5 text-xs font-bold text-white hover:bg-amberGold-hover transition"
                  >
                    Order Now
                  </Link>
                </div>
              </div>

              {/* Artisanal Rose Milk Bottle Card */}
              <div className="rounded-2xl border border-amberGold/30 bg-coffee-900/80 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="relative h-44 w-full overflow-hidden rounded-xl border border-amberGold/20">
                    <Image
                      src="/images/cafe/rose_milk.jpeg"
                      alt="Signature Rose Milk Bottle"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="rounded-md bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-300">
                    Iconic Beverage
                  </span>
                  <h3 className="font-serif text-lg font-bold text-cream-50">
                    Signature Artisanal Rose Milk (300ml)
                  </h3>
                  <p className="text-xs text-coffee-300 leading-relaxed">
                    Slow-infused with Damascus rose petals, whole milk, crushed pistachios and cardamom. Chilled fresh.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-coffee-800">
                  <span className="text-base font-extrabold text-amberGold">₹159</span>
                  <Link
                    href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                    className="rounded-xl bg-amberGold px-4 py-1.5 text-xs font-bold text-white hover:bg-amberGold-hover transition"
                  >
                    Order Now
                  </Link>
                </div>
              </div>

              {/* Turkish Kunafa Dessert Card */}
              <div className="rounded-2xl border border-amberGold/30 bg-coffee-900/80 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="relative h-44 w-full overflow-hidden rounded-xl border border-amberGold/20">
                    <Image
                      src="https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800&auto=format&fit=crop"
                      alt="Turkish Cheese Kunafa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="rounded-md bg-amberGold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Grand Finale
                  </span>
                  <h3 className="font-serif text-lg font-bold text-cream-50">
                    Authentic Turkish Cheese Kunafa
                  </h3>
                  <p className="text-xs text-coffee-300 leading-relaxed">
                    Golden spun pastry threads drenched in rose blossom syrup, stretchy sweet akawi cheese, and pistachios.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-coffee-800">
                  <span className="text-base font-extrabold text-amberGold">₹299</span>
                  <Link
                    href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                    className="rounded-xl bg-amberGold px-4 py-1.5 text-xs font-bold text-white hover:bg-amberGold-hover transition"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: HOW IT WORKS TABLE QR BANNER */}
        <section className="py-16 bg-cream-50 border-t border-coffee-200/60">
          <div className="mx-auto max-w-5xl px-4 text-center space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amberGold/30 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amberGold shadow-xs">
                <QrCode className="h-3.5 w-3.5" />
                <span>Contactless Smart Dine-In</span>
              </div>
              <h2 className="font-serif text-3xl font-extrabold text-coffee-950">
                How Ordering at Your Table Works
              </h2>
              <p className="text-xs sm:text-sm text-coffee-600 max-w-md mx-auto">
                No waving hands or waiting for a paper menu. 3 easy steps from your phone:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-soft space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coffee-950 text-amberGold font-extrabold text-sm shadow">
                  1
                </div>
                <h4 className="font-serif text-base font-bold text-coffee-950">Scan Table Stand</h4>
                <p className="text-xs text-coffee-600 leading-relaxed">
                  Open your camera app and scan the QR code located on your table stand (e.g. Table T01).
                </p>
              </div>

              <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-soft space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amberGold text-white font-extrabold text-sm shadow">
                  2
                </div>
                <h4 className="font-serif text-base font-bold text-coffee-950">Customize Your Plate</h4>
                <p className="text-xs text-coffee-600 leading-relaxed">
                  Browse HD food photographs, filter pure veg/non-veg, and add notes like "less spicy" or "no onion".
                </p>
              </div>

              <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-soft space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow">
                  3
                </div>
                <h4 className="font-serif text-base font-bold text-coffee-950">Instant Kitchen Delivery</h4>
                <p className="text-xs text-coffee-600 leading-relaxed">
                  Our chef receives your order in seconds on the KDS dashboard and serves it hot to your table.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-coffee-950 px-8 py-4 text-sm font-bold text-cream-100 hover:bg-amberGold transition shadow-premium"
              >
                <UtensilsCrossed className="h-4 w-4 text-amberGold" />
                <span>Start Dining at Table {tableNumber || 'T01'}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING BOTTOM CART BAR (When items in cart) */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between rounded-2xl border border-amberGold/40 bg-coffee-950 p-3.5 text-cream-100 shadow-elevated backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amberGold text-white font-extrabold text-sm shadow">
                {totalItemCount}
              </div>
              <div>
                <p className="text-xs font-bold text-cream-50">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in plate
                </p>
                <p className="text-xs font-extrabold text-amberGold">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amberGold px-4 py-2 text-xs font-bold text-white hover:bg-amberGold-hover shadow transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>View Cart</span>
            </button>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
