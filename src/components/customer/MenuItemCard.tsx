'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, Clock, Flame } from 'lucide-react';
import { IMenuItem } from '@/types';
import { VegBadge } from '@/components/common/VegBadge';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface MenuItemCardProps {
  item: IMenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const displayPrice = item.discount_price ?? item.price;
  const hasDiscount = Boolean(item.discount_price && item.discount_price < item.price);

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-3.5 shadow-soft transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 ${
        item.is_available
          ? 'border-coffee-200/60 hover:border-coffee-300'
          : 'border-coffee-200/40 opacity-75 grayscale-[20%]'
      }`}
    >
      <div>
        {/* Top: Image & Badge */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-coffee-100">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
            <div className="rounded-md bg-white/95 px-1.5 py-1 shadow-sm backdrop-blur-sm">
              <VegBadge isVeg={item.is_veg} size="sm" showLabel={false} />
            </div>

            {item.tags && item.tags.length > 0 && (
              <span className="rounded-md bg-coffee-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                {item.tags[0]}
              </span>
            )}
          </div>

          {/* Prep Time & Spicy Indicator */}
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5">
            {item.spicy_level && item.spicy_level > 0 ? (
              <span className="flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-red-400 backdrop-blur-sm">
                <Flame className="h-3 w-3 fill-red-400" />
                {item.spicy_level > 1 ? 'Spicy' : 'Mild'}
              </span>
            ) : null}

            <span className="flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-cream-100 backdrop-blur-sm">
              <Clock className="h-3 w-3 text-amberGold" />
              {item.prep_time_minutes}m
            </span>
          </div>

          {/* Sold Out Overlay */}
          {!item.is_available && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-coffee-950/70 backdrop-blur-xs">
              <span className="rounded-lg bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                Sold Out Today
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="pt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-base font-bold text-coffee-950 leading-snug group-hover:text-amberGold transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-coffee-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer: Price & Add / Quantity Buttons */}
      <div className="pt-3 mt-2 border-t border-coffee-100 flex items-center justify-between">
        {/* Price in INR */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-coffee-950">
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-coffee-400 line-through">
                {formatCurrency(item.price)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-coffee-500 font-medium">Inclusive of taxes</span>
        </div>

        {/* Action Controls */}
        <div>
          {!item.is_available ? (
            <button
              disabled
              className="rounded-xl bg-coffee-200 px-3 py-1.5 text-xs font-semibold text-coffee-500 cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addItem(item, 1)}
              className="flex items-center gap-1.5 rounded-xl bg-coffee-950 px-3.5 py-2 text-xs font-bold text-cream-100 shadow-sm transition-all hover:bg-amberGold hover:shadow active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center rounded-xl border border-amberGold/40 bg-amberGold/10 p-0.5 shadow-sm">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-coffee-950 shadow-xs transition hover:bg-coffee-100 active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="w-7 text-center text-xs font-bold text-coffee-950">
                {quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-coffee-950 text-cream-100 shadow-xs transition hover:bg-amberGold active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
