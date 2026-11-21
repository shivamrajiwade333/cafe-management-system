'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, QrCode, Sparkles, Utensils, Star, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { defaultCafe } from '@/lib/store';

export const HeroSection: React.FC = () => {
  const { tableNumber } = useCart();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 text-cream-100 py-16 sm:py-24">
      {/* Background Ambient Glow & Wave Accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-amberGold blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-coffee-500 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Cafe Brand Story & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Table Identification Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amberGold/40 bg-coffee-900/80 px-4 py-1.5 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold tracking-wide text-cream-200">
                Connected to <strong className="text-amberGold font-bold">Table {tableNumber || 'T01'}</strong>
              </span>
              <span className="text-xs text-coffee-400">•</span>
              <span className="text-xs text-coffee-300">Dine-In Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-cream-50 leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amberGold to-amber-500">
                {defaultCafe.name}
              </span>
            </h1>

            {/* Tagline & Subtext */}
            <p className="text-base sm:text-lg text-coffee-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Enjoy your dining experience! From slow-roasted authentic Arabian shawarmas and wood-fired Napoli pizzas to artisan sourdough melts and specialty brews—freshly prepared and served right to your table.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={`/menu?cafe=cafe001&table=${tableNumber || 'T01'}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amberGold to-amber-600 px-8 py-4 text-base font-bold text-white shadow-premium hover:brightness-110 active:scale-95 transition-all"
              >
                <Utensils className="h-5 w-5" />
                <span>Explore Our Menu</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#ambiance-gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-coffee-400/30 bg-coffee-800/40 px-6 py-4 text-sm font-semibold text-cream-100 hover:bg-coffee-800 transition"
              >
                <Sparkles className="h-4 w-4 text-amberGold" />
                <span>View Cafe Ambiance</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-coffee-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="flex items-center gap-1 text-amberGold text-xs font-bold">
                  <Star className="h-4 w-4 fill-amberGold" />
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-[11px] text-coffee-400 mt-0.5">Top-Rated Cafe</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <Clock className="h-4 w-4" />
                  <span>10-15 Min</span>
                </div>
                <p className="text-[11px] text-coffee-400 mt-0.5">Fresh Prep Time</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-cream-200 text-xs font-bold">
                  <ShieldCheck className="h-4 w-4 text-amberGold" />
                  <span>100% Halal</span>
                </div>
                <p className="text-[11px] text-coffee-400 mt-0.5">& Pure Veg Options</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase using Real Uploaded Photographs */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Storefront Image Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-2 border-amberGold/30 shadow-elevated">
                <Image
                  src="/images/cafe/storefront.jpeg"
                  alt="The Shawarma Palace Cafe Storefront"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-transparent to-transparent opacity-80" />

                {/* Badge Overlay */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-coffee-950/80 backdrop-blur-md border border-amberGold/30 text-cream-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amberGold">
                      Authentic Dining Bistro
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      ● Open Now
                    </span>
                  </div>
                  <p className="font-serif text-base font-bold text-cream-50">
                    The Shawarma Palace Cafe
                  </p>
                  <p className="text-[11px] text-coffee-300">
                    Palace Boulevard, MG Road, Pune
                  </p>
                </div>
              </div>

              {/* Floating Interior Preview Card */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-coffee-400/30 bg-coffee-900/90 p-3 shadow-premium backdrop-blur-md">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-amberGold/30">
                  <Image
                    src="/images/cafe/interior_main.jpeg"
                    alt="Interior Dining"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-cream-50">Luxury Dining Lounge</p>
                  <p className="text-[10px] text-coffee-400">Air Conditioned • Cosy Seating</p>
                </div>
              </div>

              {/* Floating QR Quick Scan Tip */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl border border-amberGold/40 bg-amberGold/90 px-3.5 py-2 shadow-premium backdrop-blur-md text-white">
                <QrCode className="h-4 w-4" />
                <span className="text-xs font-bold">QR Table Ordering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
