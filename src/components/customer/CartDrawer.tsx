'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  UtensilsCrossed, 
  CheckCircle2, 
  Loader2, 
  Receipt, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { VegBadge } from '@/components/common/VegBadge';
import { IOrder } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    items,
    tableNumber,
    specialInstructions,
    setSpecialInstructions,
    subtotal,
    taxAmount,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    placeOrder,
    isOrdering,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<IOrder | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isOrdering) return;

    const order = await placeOrder(customerName);
    if (order) {
      setConfirmedOrder(order);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97706', '#15803d', '#362218', '#fef3c7'],
        });
      } catch {
        // ignore
      }
    }
  };

  const resetAndClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md bg-cream-50 text-coffee-950 shadow-2xl flex flex-col justify-between">
          
          {/* HEADER */}
          <div className="border-b border-coffee-200/60 bg-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-coffee-950 p-2 text-cream-100">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-coffee-950">
                  Your Table Order
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-coffee-600">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-amberGold" />
                  <span>Dine-In Table: <strong className="text-coffee-950">{tableNumber || 'T01'}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-coffee-500 hover:bg-coffee-100 transition"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* CONFIRMATION SCREEN OVERLAY (When Order Placed) */}
          {confirmedOrder ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-center animate-in zoom-in-95 duration-200 bg-white">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <div className="space-y-1">
                <span className="rounded-full bg-amberGold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amberGold-hover">
                  Order Successfully Placed!
                </span>
                <h3 className="font-serif text-2xl font-bold text-coffee-950 pt-2">
                  Sending to Kitchen
                </h3>
                <p className="text-xs text-coffee-600 max-w-xs mx-auto">
                  The chef at The Shawarma Palace Cafe has received your order on Table {confirmedOrder.table_number}.
                </p>
              </div>

              {/* Order ID & Details Card */}
              <div className="rounded-2xl border border-coffee-200 bg-cream-100/60 p-4 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-coffee-200/60 pb-2">
                  <span className="text-xs font-semibold text-coffee-600">Order ID</span>
                  <span className="font-mono text-xs font-bold text-coffee-950 bg-white px-2 py-0.5 rounded border border-coffee-200">
                    {confirmedOrder.id}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-coffee-200/60 pb-2">
                  <span className="text-xs font-semibold text-coffee-600">Table Number</span>
                  <span className="text-xs font-bold text-coffee-950">
                    Table {confirmedOrder.table_number}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-500">
                    Ordered Dishes ({confirmedOrder.items.length})
                  </span>
                  {confirmedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-xs text-coffee-800">
                      <span>{it.quantity}x {it.item_name}</span>
                      <span className="font-semibold">{formatCurrency(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-coffee-300/80 pt-2 text-sm font-bold text-coffee-950">
                  <span>Total Bill (incl. 5% GST)</span>
                  <span className="text-amberGold font-extrabold">{formatCurrency(confirmedOrder.total_amount)}</span>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href={`/track-order?orderId=${confirmedOrder.id}`}
                  onClick={resetAndClose}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-coffee-950 px-5 py-3 text-sm font-bold text-cream-100 shadow-md hover:bg-amberGold transition"
                >
                  <Clock className="h-4 w-4" />
                  <span>Live Track Order Status</span>
                </Link>

                <button
                  onClick={resetAndClose}
                  className="w-full rounded-xl border border-coffee-300 py-2.5 text-xs font-semibold text-coffee-700 hover:bg-coffee-100 transition"
                >
                  Order More Dishes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* BODY: CART ITEMS LIST */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coffee-100 text-coffee-400">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-coffee-900">
                        Your plate is empty
                      </p>
                      <p className="text-xs text-coffee-500 max-w-xs mt-1">
                        Explore our freshly roasted shawarmas, crispy burgers, pizzas and artisanal shakes to get started!
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-xl bg-coffee-950 px-5 py-2.5 text-xs font-bold text-cream-100 hover:bg-amberGold transition"
                    >
                      Browse Menu Items
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map(({ menuItem, quantity }) => {
                        const itemPrice = menuItem.discount_price ?? menuItem.price;
                        return (
                          <div
                            key={menuItem.id}
                            className="flex items-center gap-3 rounded-xl border border-coffee-200/70 bg-white p-3 shadow-xs"
                          >
                            {/* Item Photo */}
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-coffee-100">
                              <Image
                                src={menuItem.image_url}
                                alt={menuItem.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <VegBadge isVeg={menuItem.is_veg} size="sm" />
                                <h4 className="text-xs font-bold text-coffee-950 truncate">
                                  {menuItem.name}
                                </h4>
                              </div>
                              <p className="text-xs font-semibold text-coffee-700 mt-0.5">
                                {formatCurrency(itemPrice)}
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center rounded-lg border border-coffee-300 bg-coffee-50 p-0.5">
                                  <button
                                    onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                                    className="flex h-6 w-6 items-center justify-center rounded bg-white text-coffee-950 hover:bg-coffee-100"
                                    aria-label="Decrease"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-coffee-950">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                                    className="flex h-6 w-6 items-center justify-center rounded bg-coffee-950 text-cream-100 hover:bg-amberGold"
                                    aria-label="Increase"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(menuItem.id)}
                                  className="text-coffee-400 hover:text-red-500 transition p-1"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Line Total */}
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-coffee-950">
                                {formatCurrency(itemPrice * quantity)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Special Instructions Input */}
                    <div className="rounded-xl border border-coffee-200/80 bg-white p-3 space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-600 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-amberGold" />
                        <span>Special Cooking Instructions (Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Less spicy, no onion, extra garlic mayo..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full rounded-lg border border-coffee-200 bg-cream-50/50 px-3 py-2 text-xs text-coffee-950 placeholder:text-coffee-400 focus:border-amberGold focus:outline-none"
                      />
                    </div>

                    {/* Customer Name Input (Optional) */}
                    <div className="rounded-xl border border-coffee-200/80 bg-white p-3 space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-600">
                        Guest Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Your name for the order ticket"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-lg border border-coffee-200 bg-cream-50/50 px-3 py-2 text-xs text-coffee-950 placeholder:text-coffee-400 focus:border-amberGold focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* FOOTER: TOTAL BREAKDOWN & PLACE ORDER BUTTON */}
              {items.length > 0 && (
                <div className="border-t border-coffee-200/60 bg-white p-4 space-y-3 shadow-lg">
                  <div className="space-y-1.5 text-xs text-coffee-700">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-coffee-950">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-coffee-500">
                      <span>Restaurant GST (5%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-coffee-200 pt-2 text-sm font-extrabold text-coffee-950">
                      <span>Grand Total</span>
                      <span className="text-base text-amberGold-hover">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Place Order Button with Anti-Double-Click Protection */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coffee-950 to-coffee-900 py-3.5 text-sm font-bold text-cream-100 shadow-md hover:from-amberGold hover:to-amber-600 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOrdering ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-amberGold" />
                        <span>Confirming with Kitchen...</span>
                      </>
                    ) : (
                      <>
                        <Receipt className="h-4 w-4 text-amberGold" />
                        <span>Place Order • {formatCurrency(totalAmount)}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-coffee-400">
                    Payment will be collected at table or billing counter upon serving.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
