'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IMenuItem, IOrder, IOrderItem } from '@/types';
import { defaultCafe, dataStore } from '@/lib/store';
import { generateOrderId } from '@/lib/utils';

export interface ICartItem {
  menuItem: IMenuItem;
  quantity: number;
}

interface CartContextType {
  items: ICartItem[];
  cafeId: string;
  tableNumber: string;
  specialInstructions: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  totalItemCount: number;
  isOrdering: boolean;
  lastPlacedOrder: IOrder | null;
  setTableNumber: (table: string) => void;
  setCafeId: (cafe: string) => void;
  setSpecialInstructions: (note: string) => void;
  addItem: (item: IMenuItem, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
  placeOrder: (customerName?: string, phone?: string) => Promise<IOrder | null>;
  setLastPlacedOrder: (order: IOrder | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [cafeId, setCafeId] = useState<string>('cafe001');
  const [tableNumber, setTableNumber] = useState<string>('T01');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<IOrder | null>(null);

  // Initialize from URL / LocalStorage on client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const cafeParam = params.get('cafe');
    const tableParam = params.get('table');

    if (cafeParam) {
      setCafeId(cafeParam);
      localStorage.setItem('cafe_active_id', cafeParam);
    } else {
      const savedCafe = localStorage.getItem('cafe_active_id');
      if (savedCafe) setCafeId(savedCafe);
    }

    if (tableParam) {
      const formatted = tableParam.toUpperCase();
      setTableNumber(formatted);
      localStorage.setItem('cafe_active_table', formatted);
    } else {
      const savedTable = localStorage.getItem('cafe_active_table');
      if (savedTable) setTableNumber(savedTable);
    }

    // Load saved cart from localStorage
    try {
      const savedCart = localStorage.getItem('cafe_cart_items');
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedOrder = localStorage.getItem('cafe_last_order');
      if (savedOrder) setLastPlacedOrder(JSON.parse(savedOrder));
    } catch {
      // ignore
    }
  }, []);

  // Persist cart items on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cafe_cart_items', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (item: IMenuItem, qty: number = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.menuItem.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].quantity += qty;
        return next;
      }
      return [...prev, { menuItem: item, quantity: qty }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const getItemQuantity = (itemId: string): number => {
    const item = items.find((i) => i.menuItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
    setSpecialInstructions('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cafe_cart_items');
    }
  };

  const subtotal = items.reduce(
    (sum, i) => sum + (i.menuItem.discount_price ?? i.menuItem.price) * i.quantity,
    0
  );
  const taxRate = defaultCafe.tax_rate_percent / 100; // 5%
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Prevent accidental duplicate order submission
  const placeOrder = async (customerName?: string, phone?: string): Promise<IOrder | null> => {
    if (items.length === 0 || isOrdering) return null;

    try {
      setIsOrdering(true);
      const orderId = generateOrderId();
      const orderItems: IOrderItem[] = items.map((cartItem, idx) => ({
        id: `oi-${orderId}-${idx + 1}`,
        order_id: orderId,
        menu_item_id: cartItem.menuItem.id,
        item_name: cartItem.menuItem.name,
        item_price: cartItem.menuItem.discount_price ?? cartItem.menuItem.price,
        is_veg: cartItem.menuItem.is_veg,
        quantity: cartItem.quantity,
        subtotal: (cartItem.menuItem.discount_price ?? cartItem.menuItem.price) * cartItem.quantity,
        image_url: cartItem.menuItem.image_url,
      }));

      const newOrder: IOrder = {
        id: orderId,
        cafe_id: cafeId || 'cafe001',
        table_number: tableNumber || 'T01',
        status: 'pending',
        customer_name: customerName || 'Dine-In Guest',
        customer_phone: phone || '',
        special_instructions: specialInstructions,
        items: orderItems,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Send order to shared server API so Manager Dashboard on another device receives it instantly
      let saved: IOrder = newOrder;
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newOrder }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            saved = data.order;
          }
        }
      } catch (networkErr) {
        console.warn('Network API order submission failed, falling back to local store:', networkErr);
      }

      // Also update local store & broadcast for local tab listeners
      await dataStore.placeOrder(saved);
      setLastPlacedOrder(saved);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cafe_last_order', JSON.stringify(saved));
      }

      // Clear current active cart
      clearCart();
      return saved;
    } catch (err) {
      console.error('Failed to place order:', err);
      return null;
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cafeId,
        tableNumber,
        specialInstructions,
        subtotal,
        taxAmount,
        totalAmount,
        totalItemCount,
        isOrdering,
        lastPlacedOrder,
        setTableNumber,
        setCafeId,
        setSpecialInstructions,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        placeOrder,
        setLastPlacedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
