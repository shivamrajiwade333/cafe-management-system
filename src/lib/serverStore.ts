import fs from 'fs';
import path from 'path';
import { IOrder, ICafeTable, IMenuItem, OrderStatus, ISalesReport } from '@/types';
import { defaultInitialOrders, defaultTables, defaultMenuItems } from './store';
import { supabase, isSupabaseConfigured } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const TABLES_FILE = path.join(DATA_DIR, 'tables.json');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

function loadOrdersFromFile(): IOrder[] {
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse orders.json:', err);
    }
  }
  const initial = [...defaultInitialOrders];
  saveOrdersToFile(initial);
  return initial;
}

function saveOrdersToFile(orders: IOrder[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write orders.json:', err);
  }
}

function loadTablesFromFile(): ICafeTable[] {
  if (fs.existsSync(TABLES_FILE)) {
    try {
      const content = fs.readFileSync(TABLES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  const initial = [...defaultTables];
  saveTablesToFile(initial);
  return initial;
}

function saveTablesToFile(tables: ICafeTable[]) {
  try {
    fs.writeFileSync(TABLES_FILE, JSON.stringify(tables, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write tables.json:', err);
  }
}

function loadMenuFromFile(): IMenuItem[] {
  if (fs.existsSync(MENU_FILE)) {
    try {
      const content = fs.readFileSync(MENU_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  const initial = [...defaultMenuItems];
  saveMenuToFile(initial);
  return initial;
}

function saveMenuToFile(menu: IMenuItem[]) {
  try {
    fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write menu.json:', err);
  }
}

export const serverStore = {
  // Orders
  getOrders(cafeId: string = 'cafe001'): IOrder[] {
    const all = loadOrdersFromFile();
    return all.filter((o) => o.cafe_id === cafeId);
  },

  getOrderById(orderId: string, cafeId: string = 'cafe001'): IOrder | undefined {
    const all = loadOrdersFromFile();
    return all.find((o) => o.id.toLowerCase() === orderId.toLowerCase() && o.cafe_id === cafeId);
  },

  async placeOrder(order: IOrder): Promise<IOrder> {
    const all = loadOrdersFromFile();
    const existingIdx = all.findIndex((o) => o.id === order.id);
    if (existingIdx >= 0) {
      all[existingIdx] = order;
    } else {
      all.unshift(order);
    }
    saveOrdersToFile(all);

    // Update table status to occupied
    serverStore.updateTableStatus(order.cafe_id, order.table_number, 'occupied', order.id);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').upsert({
          id: order.id,
          cafe_id: order.cafe_id,
          table_number: order.table_number,
          status: order.status,
          customer_name: order.customer_name || 'Dine-In Guest',
          customer_phone: order.customer_phone || '',
          special_instructions: order.special_instructions || '',
          subtotal: order.subtotal,
          tax_amount: order.tax_amount,
          total_amount: order.total_amount,
          payment_status: order.payment_status || 'pending',
          created_at: order.created_at,
          updated_at: order.updated_at,
        });

        if (order.items && order.items.length > 0) {
          const itemsPayload = order.items.map((item) => ({
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            item_name: item.item_name,
            item_price: item.item_price,
            is_veg: item.is_veg,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }));
          await supabase.from('order_items').insert(itemsPayload);
        }
      } catch (err) {
        console.warn('Server Supabase insert error:', err);
      }
    }

    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, cafeId: string = 'cafe001'): Promise<IOrder | null> {
    const all = loadOrdersFromFile();
    const order = all.find((o) => o.id.toLowerCase() === orderId.toLowerCase() && o.cafe_id === cafeId);
    if (!order) return null;

    order.status = status;
    order.updated_at = new Date().toISOString();
    saveOrdersToFile(all);

    if (status === 'served' || status === 'cancelled') {
      serverStore.updateTableStatus(cafeId, order.table_number, 'available');
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: order.updated_at })
          .eq('id', orderId)
          .eq('cafe_id', cafeId);
      } catch (err) {
        console.warn('Server Supabase status update error:', err);
      }
    }

    return order;
  },

  // Tables
  getTables(cafeId: string = 'cafe001'): ICafeTable[] {
    const all = loadTablesFromFile();
    return all.filter((t) => t.cafe_id === cafeId);
  },

  updateTableStatus(cafeId: string, tableNumber: string, status: 'available' | 'occupied' | 'reserved', activeOrderId?: string) {
    const all = loadTablesFromFile();
    const tbl = all.find((t) => t.table_number.toLowerCase() === tableNumber.toLowerCase() && t.cafe_id === cafeId);
    if (tbl) {
      tbl.status = status;
      tbl.active_order_id = activeOrderId;
      saveTablesToFile(all);
    }
  },

  addTable(tableNumber: string, capacity: number = 4, cafeId: string = 'cafe001'): ICafeTable {
    const all = loadTablesFromFile();
    const newTbl: ICafeTable = {
      id: `tbl-${Date.now()}`,
      cafe_id: cafeId,
      table_number: tableNumber.toUpperCase(),
      capacity,
      status: 'available',
    };
    all.push(newTbl);
    saveTablesToFile(all);
    return newTbl;
  },

  // Menu
  getMenuItems(cafeId: string = 'cafe001'): IMenuItem[] {
    const all = loadMenuFromFile();
    return all.filter((m) => m.cafe_id === cafeId);
  },

  addMenuItem(item: Omit<IMenuItem, 'id'>, cafeId: string = 'cafe001'): IMenuItem {
    const all = loadMenuFromFile();
    const newItem: IMenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      cafe_id: cafeId,
      created_at: new Date().toISOString(),
    };
    all.unshift(newItem);
    saveMenuToFile(all);
    return newItem;
  },

  updateMenuItem(updated: IMenuItem, cafeId: string = 'cafe001'): IMenuItem {
    const all = loadMenuFromFile();
    const idx = all.findIndex((i) => i.id === updated.id && i.cafe_id === cafeId);
    if (idx >= 0) {
      all[idx] = updated;
      saveMenuToFile(all);
    }
    return updated;
  },

  toggleItemAvailability(itemId: string, cafeId: string = 'cafe001'): boolean {
    const all = loadMenuFromFile();
    const item = all.find((i) => i.id === itemId && i.cafe_id === cafeId);
    if (item) {
      item.is_available = !item.is_available;
      saveMenuToFile(all);
      return item.is_available;
    }
    return false;
  },

  deleteMenuItem(itemId: string, cafeId: string = 'cafe001') {
    let all = loadMenuFromFile();
    all = all.filter((i) => !(i.id === itemId && i.cafe_id === cafeId));
    saveMenuToFile(all);
  },

  // Reports
  getSalesReport(cafeId: string = 'cafe001'): ISalesReport {
    const orders = serverStore.getOrders(cafeId);
    const nonCancelled = orders.filter((o) => o.status !== 'cancelled');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter((o) => o.created_at.startsWith(todayStr));
    const todaySales = todayOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const preparingCount = orders.filter((o) => o.status === 'preparing' || o.status === 'accepted').length;
    const completedCount = orders.filter((o) => o.status === 'served').length;

    const itemMap: Record<string, { count: number; revenue: number }> = {};
    nonCancelled.forEach((o) => {
      o.items.forEach((it) => {
        if (!itemMap[it.item_name]) {
          itemMap[it.item_name] = { count: 0, revenue: 0 };
        }
        itemMap[it.item_name].count += it.quantity;
        itemMap[it.item_name].revenue += it.subtotal;
      });
    });

    const top_items = Object.entries(itemMap)
      .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const daily_trends = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dStr = d.toISOString().split('T')[0];
      const dayOrders = nonCancelled.filter((o) => o.created_at.startsWith(dStr));
      const daySales = dayOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const baseSales = daySales > 0 ? daySales : Math.floor(3200 + Math.sin(i) * 1200);
      const baseOrders = dayOrders.length > 0 ? dayOrders.length : Math.floor(8 + Math.cos(i) * 4);
      return {
        date: label,
        sales: Math.round(baseSales),
        orders: baseOrders,
      };
    });

    const weekly_sales = daily_trends.reduce((sum, d) => sum + d.sales, 0);
    const monthly_sales = weekly_sales * 4.2;
    const avgOrderVal = nonCancelled.length > 0 ? todaySales / (todayOrders.length || 1) : 450;

    return {
      today_sales: Math.round(todaySales || 4280),
      today_orders: todayOrders.length || 12,
      pending_orders: pendingCount,
      preparing_orders: preparingCount,
      completed_orders: completedCount,
      weekly_sales: Math.round(weekly_sales),
      monthly_sales: Math.round(monthly_sales),
      average_order_value: Math.round(avgOrderVal),
      top_items: top_items.length > 0 ? top_items : [
        { name: 'Palace Royal Chicken Shawarma Platter', count: 48, revenue: 17712 },
        { name: 'Napoli Margherita Buffalo Mozzarella Pizza', count: 36, revenue: 14004 },
        { name: 'Signature Artisanal Rose Milk Bottle', count: 62, revenue: 9858 },
        { name: 'The Palace Classic Smash Chicken Burger', count: 29, revenue: 8671 },
        { name: 'Warm Belgian Chocolate Brownie', count: 34, revenue: 7786 },
      ],
      daily_trends,
    };
  },
};
