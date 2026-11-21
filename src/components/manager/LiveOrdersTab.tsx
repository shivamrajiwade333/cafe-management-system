'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Utensils, 
  XCircle, 
  Bell, 
  Printer, 
  AlertTriangle,
  Receipt,
  Search,
  Filter
} from 'lucide-react';
import { IOrder, OrderStatus } from '@/types';
import { dataStore, defaultCafe } from '@/lib/store';
import { soundManager } from '@/lib/sound';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import { VegBadge } from '@/components/common/VegBadge';

interface LiveOrdersTabProps {
  onUpdatePendingCount: (count: number) => void;
}

export const LiveOrdersTab: React.FC<LiveOrdersTabProps> = ({ onUpdatePendingCount }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newOrderAlert, setNewOrderAlert] = useState<IOrder | null>(null);
  const [selectedPrintOrder, setSelectedPrintOrder] = useState<IOrder | null>(null);

  const loadOrders = () => {
    const list = dataStore.getOrders('cafe001');
    setOrders([...list]);
    const pending = list.filter((o) => o.status === 'pending').length;
    onUpdatePendingCount(pending);
  };

  useEffect(() => {
    loadOrders();

    // Subscribe to realtime broadcast from customer orders & status updates
    const unsubscribe = dataStore.subscribe((event) => {
      if (event.type === 'NEW_ORDER') {
        const order = event.payload as IOrder;
        soundManager.playNewOrderChime();
        setNewOrderAlert(order);
        // Auto-dismiss alert banner after 8s
        setTimeout(() => setNewOrderAlert(null), 8000);
        loadOrders();
      } else if (event.type === 'ORDER_STATUS_CHANGED') {
        soundManager.playStatusChangeBeep();
        loadOrders();
      }
    });

    const interval = setInterval(loadOrders, 4000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await dataStore.updateOrderStatus(orderId, newStatus, 'cafe001');
    loadOrders();
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? o.status === 'pending' || o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready'
        : o.status === statusFilter;

    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.item_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Print Kitchen Order Ticket (KOT)
  const triggerPrintKOT = (order: IOrder) => {
    setSelectedPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-400/40 animate-pulse';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'ready':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/40';
      case 'served':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* NEW ORDER INCOMING POPUP BANNER */}
      {newOrderAlert && (
        <div className="animate-in slide-in-from-top-4 duration-300 rounded-2xl border-2 border-amberGold bg-gradient-to-r from-coffee-950 via-coffee-900 to-coffee-950 p-4 text-cream-100 shadow-elevated flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amberGold text-white shadow animate-bounce">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white animate-pulse">
                  NEW ORDER RECEIVED
                </span>
                <span className="font-mono text-xs font-bold text-amber-300">
                  {newOrderAlert.id}
                </span>
              </div>
              <p className="font-serif text-base font-bold text-cream-50 mt-0.5">
                Table <span className="text-amberGold text-lg font-extrabold">{newOrderAlert.table_number}</span> has placed an order ({formatCurrency(newOrderAlert.total_amount)})!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateStatus(newOrderAlert.id, 'accepted')}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition"
            >
              Accept Instantly
            </button>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="rounded-xl bg-coffee-800 p-2 text-coffee-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TOP CONTROLS: STATS & FILTERS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-coffee-200 bg-white p-1.5 shadow-sm">
          {[
            { key: 'all', label: 'All Orders', count: orders.length },
            { key: 'active', label: 'Active Pipeline', count: orders.filter((o) => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)).length },
            { key: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
            { key: 'preparing', label: 'In Kitchen', count: orders.filter((o) => o.status === 'preparing' || o.status === 'accepted').length },
            { key: 'ready', label: 'Ready', count: orders.filter((o) => o.status === 'ready').length },
            { key: 'served', label: 'Served', count: orders.filter((o) => o.status === 'served').length },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === f.key
                  ? 'bg-coffee-950 text-cream-100 shadow-sm'
                  : 'text-coffee-700 hover:bg-coffee-50'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  statusFilter === f.key
                    ? 'bg-amberGold text-white'
                    : 'bg-coffee-100 text-coffee-600'
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-coffee-400" />
          <input
            type="text"
            placeholder="Search order ID or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white pl-9 pr-3 py-2 text-xs text-coffee-950 placeholder:text-coffee-400 focus:border-amberGold focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* ORDERS CARDS GRID */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-coffee-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coffee-100 text-coffee-400">
            <Receipt className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-coffee-900">
            No orders match this filter
          </h3>
          <p className="text-xs text-coffee-500 max-w-sm mx-auto">
            Place an order from the customer website or switch to "All Orders" to view full history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'pending';
            const isAccepted = order.status === 'accepted';
            const isPreparing = order.status === 'preparing';
            const isReady = order.status === 'ready';
            const isServed = order.status === 'served';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white shadow-soft transition-all duration-200 hover:shadow-premium ${
                  isPending
                    ? 'border-amberGold ring-2 ring-amberGold/30 bg-amber-50/20'
                    : isReady
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                    : 'border-coffee-200/80'
                }`}
              >
                {/* CARD HEADER */}
                <div className="border-b border-coffee-100 p-4">
                  <div className="flex items-start justify-between gap-2">
                    {/* Table Pill */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-xl bg-coffee-950 px-2.5 py-1 text-xs font-extrabold text-cream-100 shadow-xs">
                          Table {order.table_number}
                        </span>
                        <span className="font-mono text-xs font-bold text-coffee-800">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-coffee-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-coffee-400" />
                        <span>{formatTimeAgo(order.created_at)}</span>
                        {order.customer_name && (
                          <span>• {order.customer_name}</span>
                        )}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadgeStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ITEMS LIST */}
                <div className="flex-1 p-4 space-y-2">
                  <div className="space-y-1.5 divide-y divide-coffee-100/60">
                    {order.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between pt-1.5 first:pt-0 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <VegBadge isVeg={it.is_veg} size="sm" />
                          <span className="font-bold text-coffee-950">
                            {it.quantity}x
                          </span>
                          <span className="text-coffee-800 font-medium">
                            {it.item_name}
                          </span>
                        </div>
                        <span className="font-semibold text-coffee-700">
                          {formatCurrency(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions */}
                  {order.special_instructions && (
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-2.5 text-xs text-amber-900 mt-2 space-y-0.5">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Kitchen Note:
                      </span>
                      <p className="font-medium italic">"{order.special_instructions}"</p>
                    </div>
                  )}
                </div>

                {/* FOOTER: TOTAL & ACTION BUTTONS */}
                <div className="border-t border-coffee-100 bg-coffee-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-coffee-500 font-medium uppercase tracking-wider">
                        Total Amount
                      </span>
                      <p className="text-base font-extrabold text-coffee-950">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>

                    {/* Print KOT Button */}
                    <button
                      onClick={() => triggerPrintKOT(order)}
                      className="flex items-center gap-1 rounded-lg border border-coffee-200 bg-white px-2.5 py-1 text-xs font-semibold text-coffee-700 hover:bg-coffee-100 transition"
                      title="Print Kitchen Order Ticket (KOT)"
                    >
                      <Printer className="h-3.5 w-3.5 text-coffee-500" />
                      <span>Print KOT</span>
                    </button>
                  </div>

                  {/* ORDER WORKFLOW STATUS BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Primary Step Progression */}
                    {isPending && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'accepted')}
                        className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>1. Accept Order</span>
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700 shadow-xs transition"
                      >
                        <Flame className="h-4 w-4" />
                        <span>2. Start Preparing</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                        className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>3. Mark as Ready</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'served')}
                        className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-coffee-950 py-2.5 text-xs font-bold text-cream-100 hover:bg-coffee-900 shadow-xs transition"
                      >
                        <Utensils className="h-4 w-4 text-amberGold" />
                        <span>4. Mark as Served</span>
                      </button>
                    )}

                    {isServed && (
                      <div className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Completed & Served</span>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-600">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Order Cancelled</span>
                      </div>
                    )}

                    {/* Secondary Cancel Button */}
                    {!isServed && !isCancelled && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel order ${order.id}?`)) {
                            handleUpdateStatus(order.id, 'cancelled');
                          }
                        }}
                        className="col-span-2 rounded-lg border border-red-200 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HIDDEN PRINT RECEIPT / KOT MODAL FOR 80MM THERMAL PRINTER */}
      {selectedPrintOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl print:shadow-none print:w-full print:border-none border border-coffee-200 text-coffee-950 space-y-4">
            <div className="text-center space-y-1 border-b border-dashed border-coffee-300 pb-3">
              <h2 className="font-serif text-lg font-bold">{defaultCafe.name}</h2>
              <p className="text-[10px] text-coffee-600">{defaultCafe.address}</p>
              <p className="text-[10px] text-coffee-600">GSTIN: {defaultCafe.gstin}</p>
              <div className="pt-2">
                <span className="rounded bg-coffee-950 px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                  KITCHEN ORDER TICKET (KOT)
                </span>
              </div>
            </div>

            <div className="flex justify-between text-xs font-mono border-b border-dashed border-coffee-300 pb-2">
              <div>
                <p><strong>Table:</strong> {selectedPrintOrder.table_number}</p>
                <p><strong>Order:</strong> {selectedPrintOrder.id}</p>
              </div>
              <div className="text-right">
                <p>{new Date(selectedPrintOrder.created_at).toLocaleTimeString()}</p>
                <p>{new Date(selectedPrintOrder.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-1.5 border-b border-dashed border-coffee-300 pb-3">
              {selectedPrintOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs">
                  <span><strong>{it.quantity}x</strong> {it.item_name}</span>
                  <span className="font-mono">{formatCurrency(it.subtotal)}</span>
                </div>
              ))}
            </div>

            {selectedPrintOrder.special_instructions && (
              <div className="text-xs bg-amber-50 p-2 rounded border border-amber-200">
                <strong>NOTE:</strong> {selectedPrintOrder.special_instructions}
              </div>
            )}

            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(selectedPrintOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="font-mono">{formatCurrency(selectedPrintOrder.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-coffee-300 pt-1">
                <span>Total:</span>
                <span className="font-mono">{formatCurrency(selectedPrintOrder.total_amount)}</span>
              </div>
            </div>

            <div className="pt-3 print:hidden flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-coffee-950 py-2 text-xs font-bold text-white hover:bg-amberGold"
              >
                Print Now
              </button>
              <button
                onClick={() => setSelectedPrintOrder(null)}
                className="rounded-xl border border-coffee-300 px-3 py-2 text-xs text-coffee-600 hover:bg-coffee-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
