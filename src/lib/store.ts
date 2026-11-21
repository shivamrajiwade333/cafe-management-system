import { ICafe, ICategory, IMenuItem, ICafeTable, IOrder, ISalesReport, OrderStatus } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

// ==============================================================================
// DEFAULT CAFE INFO (The Shawarma Palace Cafe)
// ==============================================================================
export const defaultCafe: ICafe = {
  id: 'cafe001',
  name: 'The Shawarma Palace Cafe',
  slug: 'the-shawarma-palace',
  tagline: 'Fresh & Delicious • Delight in Every Bite',
  description: 'An artisanal dining bistro & cafe combining slow-roasted authentic shawarmas, hand-stretched wood-fired pizzas, gourmet burgers, specialty hot & cold brews, and handcrafted desserts.',
  logo_url: '/images/cafe/logo_3d.jpeg',
  hero_image_url: '/images/cafe/storefront.jpeg',
  address: 'Palace Boulevard, MG Road, Pune, Maharashtra 411001',
  phone: '+91 98234 56789',
  email: 'orders@shawarmapalace.com',
  gstin: '27AABCU9603R1ZM',
  currency_symbol: '₹',
  tax_rate_percent: 5.0, // 5% GST (2.5% CGST + 2.5% SGST)
};

// ==============================================================================
// 8 MANDATORY FOOD CATEGORIES
// ==============================================================================
export const defaultCategories: ICategory[] = [
  { id: 'cat-starters', cafe_id: 'cafe001', name: 'Starters', slug: 'starters', description: 'Crispy falafels, loaded fries, hummus platters & chicken strips', icon: 'Utensils', display_order: 1, is_active: true },
  { id: 'cat-main', cafe_id: 'cafe001', name: 'Main Course', slug: 'main-course', description: 'Signature Shawarma platters, rice bowls & sizzlers', icon: 'Flame', display_order: 2, is_active: true },
  { id: 'cat-pizza', cafe_id: 'cafe001', name: 'Pizza', slug: 'pizza', description: 'Hand-tossed thin crust artisanal pizzas baked to golden perfection', icon: 'Pizza', display_order: 3, is_active: true },
  { id: 'cat-burgers', cafe_id: 'cafe001', name: 'Burgers', slug: 'burgers', description: 'Brioche bun smash burgers with house-made sauces & crispy patties', icon: 'Beef', display_order: 4, is_active: true },
  { id: 'cat-sandwiches', cafe_id: 'cafe001', name: 'Sandwiches', slug: 'sandwiches', description: 'Grilled sourdough melts, paninis & classic club sandwiches', icon: 'Sandwich', display_order: 5, is_active: true },
  { id: 'cat-pasta', cafe_id: 'cafe001', name: 'Pasta', slug: 'pasta', description: 'Italian al dente pasta tossed in rich Alfredo, Arrabbiata & Pesto sauces', icon: 'Soup', display_order: 6, is_active: true },
  { id: 'cat-beverages', cafe_id: 'cafe001', name: 'Beverages', slug: 'beverages', description: 'Artisanal Rose Milk, specialty hot coffees, mocktails & cold brews', icon: 'CupSoda', display_order: 7, is_active: true },
  { id: 'cat-desserts', cafe_id: 'cafe001', name: 'Desserts', slug: 'desserts', description: 'Warm brownies with Belgian chocolate, Kunafa & cheesecakes', icon: 'Cake', display_order: 8, is_active: true },
];

// ==============================================================================
// MENU ITEMS WITH PHOTOGRAPHS & INR PRICES
// ==============================================================================
export const defaultMenuItems: IMenuItem[] = [
  // --- STARTERS ---
  {
    id: 'item-st-1',
    cafe_id: 'cafe001',
    category_id: 'cat-starters',
    category_name: 'Starters',
    name: 'Lebanese Mezze & Hummus Platter',
    description: 'Creamy velvety tahini hummus drizzled with extra virgin olive oil, served with 4 crispy herb falafels, pickled olives, and warm pita bread.',
    price: 249,
    discount_price: 229,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 10,
    tags: ['Bestseller', 'Healthy'],
  },
  {
    id: 'item-st-2',
    cafe_id: 'cafe001',
    category_id: 'cat-starters',
    category_name: 'Starters',
    name: 'Crispy Peri-Peri Chicken Poppers',
    description: 'Tender chicken bites double-crusted in panko crumb, tossed in spicy African peri-peri dust, served with garlic toum dip.',
    price: 289,
    image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 12,
    spicy_level: 2,
    tags: ['Spicy Crunch'],
  },
  {
    id: 'item-st-3',
    cafe_id: 'cafe001',
    category_id: 'cat-starters',
    category_name: 'Starters',
    name: 'Truffle & Parmesan Loaded French Fries',
    description: 'Golden skin-on potato fries dusted with aromatic white truffle oil, freshly grated Grana Padano parmesan and chives.',
    price: 219,
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 8,
    tags: ['Must Try'],
  },

  // --- MAIN COURSE ---
  {
    id: 'item-mc-1',
    cafe_id: 'cafe001',
    category_id: 'cat-main',
    category_name: 'Main Course',
    name: 'Palace Royal Chicken Shawarma Platter',
    description: 'Our flagship signature dish! 24h marinated rotisserie grilled chicken strips served over fragrant saffron butter rice with Lebanese toum, pickled turnip and grilled pita.',
    price: 369,
    discount_price: 349,
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 15,
    tags: ['Chef Signature', 'Palace Special'],
  },
  {
    id: 'item-mc-2',
    cafe_id: 'cafe001',
    category_id: 'cat-main',
    category_name: 'Main Course',
    name: 'Grilled Cottage Cheese & Herb Rice Bowl',
    description: 'Marinated paneer steak grilled over lava stones, served with sauteed Mediterranean garden veggies, spicy harissa sauce and aromatic herb rice.',
    price: 329,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 14,
    tags: ['High Protein'],
  },
  {
    id: 'item-mc-3',
    cafe_id: 'cafe001',
    category_id: 'cat-main',
    category_name: 'Main Course',
    name: 'Authentic Charcoal Smoked Chicken Shawarma Roll',
    description: 'Thin rumali wrap packed with succulently spiced rotisserie chicken, crispy fries inside, authentic Lebanese garlic toum and red sumac onions.',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 10,
    spicy_level: 1,
    tags: ['Super Hit'],
  },

  // --- PIZZA ---
  {
    id: 'item-pz-1',
    cafe_id: 'cafe001',
    category_id: 'cat-pizza',
    category_name: 'Pizza',
    name: 'Napoli Margherita Buffalo Mozzarella Pizza',
    description: 'Hand-stretched sourdough base, San Marzano tomato sauce, fresh creamy buffalo mozzarella, sweet Italian basil and cold pressed olive oil.',
    price: 389,
    image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 15,
    tags: ['Classic Italian'],
  },
  {
    id: 'item-pz-2',
    cafe_id: 'cafe001',
    category_id: 'cat-pizza',
    category_name: 'Pizza',
    name: 'Spicy Smoked Chicken & Jalapeno Pizza',
    description: 'Wood-fired crust loaded with house BBQ chicken chunks, pickled jalapenos, red bell peppers, smoked scamorza and mozzarella cheese.',
    price: 449,
    discount_price: 419,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 16,
    spicy_level: 2,
    tags: ['Top Pick'],
  },
  {
    id: 'item-pz-3',
    cafe_id: 'cafe001',
    category_id: 'cat-pizza',
    category_name: 'Pizza',
    name: 'Quattro Formaggi (Four Cheese Bliss)',
    description: 'Mozzarella, English cheddar, aged Parmesan, and blue cheese drizzled with a touch of organic thyme honey.',
    price: 429,
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 15,
    tags: ['Cheese Lover'],
  },

  // --- BURGERS ---
  {
    id: 'item-bg-1',
    cafe_id: 'cafe001',
    category_id: 'cat-burgers',
    category_name: 'Burgers',
    name: 'The Palace Classic Smash Chicken Burger',
    description: 'Crispy fried spiced chicken fillet, melted cheddar slice, spicy chipotle mayo, crunchy iceberg lettuce in a toasted butter brioche bun.',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 12,
    tags: ['Bestseller'],
  },
  {
    id: 'item-bg-2',
    cafe_id: 'cafe001',
    category_id: 'cat-burgers',
    category_name: 'Burgers',
    name: 'Crispy Paneer Makhani Burger',
    description: 'Golden spiced paneer steak dipped in rich velvety makhani glaze, layered with onions, mint mayo and fresh lettuce in toasted brioche.',
    price: 269,
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 12,
    tags: ['Indian Fusion'],
  },

  // --- SANDWICHES ---
  {
    id: 'item-sw-1',
    cafe_id: 'cafe001',
    category_id: 'cat-sandwiches',
    category_name: 'Sandwiches',
    name: 'Artisan Grilled Chicken Club Sandwich',
    description: 'Triple-decker sourdough stuffed with tender herb roast chicken, fried egg, cheddar slice, juicy tomatoes, and house honey mustard.',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 10,
    tags: ['Hearty Snack'],
  },
  {
    id: 'item-sw-2',
    cafe_id: 'cafe001',
    category_id: 'cat-sandwiches',
    category_name: 'Sandwiches',
    name: 'Spinach, Corn & 3-Cheese Sourdough Melt',
    description: 'Creamed American sweet corn, wilted baby spinach, mozzarella and cheddar pressed in golden buttery artisan bread.',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 9,
    tags: ['Cafe Classic'],
  },

  // --- PASTA ---
  {
    id: 'item-ps-1',
    cafe_id: 'cafe001',
    category_id: 'cat-pasta',
    category_name: 'Pasta',
    name: 'Creamy Truffle Mushroom Fettuccine',
    description: 'Handcrafted pasta ribbons tossed in a rich French butter and garlic cream sauce with wild shiitake mushrooms and shaved parmesan.',
    price: 379,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 15,
    tags: ['Gourmet'],
  },
  {
    id: 'item-ps-2',
    cafe_id: 'cafe001',
    category_id: 'cat-pasta',
    category_name: 'Pasta',
    name: 'Fiery Arrabbiata Chicken Penne',
    description: 'Penne tossed in spicy San Marzano tomato puree with garlic, chili flakes, Kalamata olives, fresh basil and roasted chicken chunks.',
    price: 399,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    is_veg: false,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 14,
    spicy_level: 2,
    tags: ['Spicy Penne'],
  },

  // --- BEVERAGES ---
  {
    id: 'item-bv-1',
    cafe_id: 'cafe001',
    category_id: 'cat-beverages',
    category_name: 'Beverages',
    name: 'Signature Artisanal Rose Milk Bottle (300ml)',
    description: 'Our iconic handcrafted chilled beverage! Slow-infused with Damascus rose petals, whole milk, crushed pistachios and hint of cardamom. Refreshingly divine.',
    price: 159,
    discount_price: 139,
    image_url: '/images/cafe/rose_milk.jpeg',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 3,
    tags: ['Signature Drink', 'Customer Favorite'],
  },
  {
    id: 'item-bv-2',
    cafe_id: 'cafe001',
    category_id: 'cat-beverages',
    category_name: 'Beverages',
    name: 'Spanish Cortado Hazelnut Hot Coffee',
    description: 'Double ristretto espresso cut with velvety steamed whole milk and house-made roasted hazelnut praline syrup.',
    price: 199,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 5,
    tags: ['Specialty Coffee'],
  },
  {
    id: 'item-bv-3',
    cafe_id: 'cafe001',
    category_id: 'cat-beverages',
    category_name: 'Beverages',
    name: 'Iced Passionfruit & Mint Sparkling Cooler',
    description: 'Real tropical passionfruit pulp, fresh garden mint, lime spritz and fizzy club soda over crushed ice.',
    price: 189,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: false,
    prep_time_minutes: 4,
    tags: ['Chilled Cooler'],
  },

  // --- DESSERTS ---
  {
    id: 'item-ds-1',
    cafe_id: 'cafe001',
    category_id: 'cat-desserts',
    category_name: 'Desserts',
    name: 'Warm Belgian Chocolate Brownie with Vanilla Gelato',
    description: 'Decadent 70% dark Belgian chocolate fudge brownie served piping hot with a scoop of Madagascar vanilla bean gelato and roasted almond slivers.',
    price: 229,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 6,
    tags: ['Bestseller'],
  },
  {
    id: 'item-ds-2',
    cafe_id: 'cafe001',
    category_id: 'cat-desserts',
    category_name: 'Desserts',
    name: 'Authentic Turkish Cheese Kunafa',
    description: 'Golden spun pastry threads drenched in rose blossom syrup, layered with stretchy sweet akawi cheese, crowned with crushed Iranian pistachios.',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800&auto=format&fit=crop',
    is_veg: true,
    is_available: true,
    is_featured: true,
    prep_time_minutes: 10,
    tags: ['Palace Special'],
  },
];

// ==============================================================================
// DEFAULT CAFE TABLES (T01 - T10)
// ==============================================================================
export const defaultTables: ICafeTable[] = [
  { id: 'tbl-1', cafe_id: 'cafe001', table_number: 'T01', capacity: 4, status: 'available' },
  { id: 'tbl-2', cafe_id: 'cafe001', table_number: 'T02', capacity: 4, status: 'available' },
  { id: 'tbl-3', cafe_id: 'cafe001', table_number: 'T03', capacity: 2, status: 'available' },
  { id: 'tbl-4', cafe_id: 'cafe001', table_number: 'T04', capacity: 6, status: 'available' },
  { id: 'tbl-5', cafe_id: 'cafe001', table_number: 'T05', capacity: 4, status: 'available' },
  { id: 'tbl-6', cafe_id: 'cafe001', table_number: 'T06', capacity: 4, status: 'available' },
  { id: 'tbl-7', cafe_id: 'cafe001', table_number: 'T07', capacity: 8, status: 'available' },
  { id: 'tbl-8', cafe_id: 'cafe001', table_number: 'T08', capacity: 2, status: 'available' },
  { id: 'tbl-9', cafe_id: 'cafe001', table_number: 'T09', capacity: 4, status: 'available' },
  { id: 'tbl-10', cafe_id: 'cafe001', table_number: 'T10', capacity: 4, status: 'available' },
];

// ==============================================================================
// INITIAL ORDERS FOR REALISTIC DEMO PRESENTATION
// ==============================================================================
export const defaultInitialOrders: IOrder[] = [
  {
    id: 'ORD-1042',
    cafe_id: 'cafe001',
    table_number: 'T02',
    status: 'preparing',
    customer_name: 'Rohan Sharma',
    special_instructions: 'Less spicy in shawarma please, extra garlic mayo',
    subtotal: 528,
    tax_amount: 26.4,
    total_amount: 554.4,
    items: [
      {
        id: 'oi-1',
        order_id: 'ORD-1042',
        menu_item_id: 'item-mc-1',
        item_name: 'Palace Royal Chicken Shawarma Platter',
        item_price: 369,
        is_veg: false,
        quantity: 1,
        subtotal: 369,
      },
      {
        id: 'oi-2',
        order_id: 'ORD-1042',
        menu_item_id: 'item-bv-1',
        item_name: 'Signature Artisanal Rose Milk Bottle (300ml)',
        item_price: 159,
        is_veg: true,
        quantity: 1,
        subtotal: 159,
      }
    ],
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1041',
    cafe_id: 'cafe001',
    table_number: 'T05',
    status: 'accepted',
    customer_name: 'Priya Verma',
    special_instructions: 'No onions in the burger, serve drinks first',
    subtotal: 717,
    tax_amount: 35.85,
    total_amount: 752.85,
    items: [
      {
        id: 'oi-3',
        order_id: 'ORD-1041',
        menu_item_id: 'item-bg-1',
        item_name: 'The Palace Classic Smash Chicken Burger',
        item_price: 299,
        is_veg: false,
        quantity: 1,
        subtotal: 299,
      },
      {
        id: 'oi-4',
        order_id: 'ORD-1041',
        menu_item_id: 'item-st-3',
        item_name: 'Truffle & Parmesan Loaded French Fries',
        item_price: 219,
        is_veg: true,
        quantity: 1,
        subtotal: 219,
      },
      {
        id: 'oi-5',
        order_id: 'ORD-1041',
        menu_item_id: 'item-bv-2',
        item_name: 'Spanish Cortado Hazelnut Hot Coffee',
        item_price: 199,
        is_veg: true,
        quantity: 1,
        subtotal: 199,
      }
    ],
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1040',
    cafe_id: 'cafe001',
    table_number: 'T01',
    status: 'ready',
    customer_name: 'Amit Patel',
    special_instructions: 'Extra napkins',
    subtotal: 618,
    tax_amount: 30.9,
    total_amount: 648.9,
    items: [
      {
        id: 'oi-6',
        order_id: 'ORD-1040',
        menu_item_id: 'item-pz-1',
        item_name: 'Napoli Margherita Buffalo Mozzarella Pizza',
        item_price: 389,
        is_veg: true,
        quantity: 1,
        subtotal: 389,
      },
      {
        id: 'oi-7',
        order_id: 'ORD-1040',
        menu_item_id: 'item-ds-1',
        item_name: 'Warm Belgian Chocolate Brownie with Vanilla Gelato',
        item_price: 229,
        is_veg: true,
        quantity: 1,
        subtotal: 229,
      }
    ],
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-1039',
    cafe_id: 'cafe001',
    table_number: 'T03',
    status: 'served',
    customer_name: 'Neha Kulkarni',
    subtotal: 478,
    tax_amount: 23.9,
    total_amount: 501.9,
    items: [
      {
        id: 'oi-8',
        order_id: 'ORD-1039',
        menu_item_id: 'item-sw-1',
        item_name: 'Artisan Grilled Chicken Club Sandwich',
        item_price: 299,
        is_veg: false,
        quantity: 1,
        subtotal: 299,
      },
      {
        id: 'oi-9',
        order_id: 'ORD-1039',
        menu_item_id: 'item-bv-3',
        item_name: 'Iced Passionfruit & Mint Sparkling Cooler',
        item_price: 189,
        is_veg: true,
        quantity: 1,
        subtotal: 189,
      }
    ],
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  }
];

// ==============================================================================
// REAL-TIME BROADCAST BUS & DUAL-MODE STORE
// Syncs customer ordering & manager dashboard seamlessly across tabs & devices
// ==============================================================================
const SYNC_CHANNEL_NAME = 'cafe_orders_sync_channel';

class CafeDataStore {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<(event: { type: string; payload: unknown }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          this.notifyLocalListeners(event.data);
        };
      } catch {
        // Fallback for older browsers
      }

      window.addEventListener('storage', (e) => {
        if (e.key === 'cafe_orders_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notifyLocalListeners(data);
          } catch {
            // ignore
          }
        }
      });
    }
  }

  private notifyLocalListeners(eventData: { type: string; payload: unknown }) {
    this.listeners.forEach((fn) => {
      try {
        fn(eventData);
      } catch (err) {
        console.error('Error in order listener:', err);
      }
    });
  }

  public subscribe(fn: (event: { type: string; payload: unknown }) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private broadcast(type: string, payload: unknown) {
    const eventData = { type, payload, timestamp: Date.now() };
    this.notifyLocalListeners(eventData);

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(eventData);
      } catch {
        // ignore
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cafe_orders_event', JSON.stringify(eventData));
      } catch {
        // ignore
      }
    }
  }

  // --- ORDERS ACCESS ---
  public getOrders(cafeId: string = 'cafe001'): IOrder[] {
    if (typeof window === 'undefined') return defaultInitialOrders;
    const key = `cafe_orders_${cafeId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultInitialOrders));
      return defaultInitialOrders;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultInitialOrders;
    }
  }

  public saveOrders(orders: IOrder[], cafeId: string = 'cafe001') {
    if (typeof window === 'undefined') return;
    const key = `cafe_orders_${cafeId}`;
    localStorage.setItem(key, JSON.stringify(orders));
  }

  public getOrderById(orderId: string, cafeId: string = 'cafe001'): IOrder | undefined {
    const orders = this.getOrders(cafeId);
    return orders.find(o => o.id === orderId);
  }

  public async placeOrder(order: IOrder): Promise<IOrder> {
    // 1. If Supabase is connected, insert to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: ordErr } = await supabase.from('orders').insert({
          id: order.id,
          cafe_id: order.cafe_id,
          table_number: order.table_number,
          status: order.status,
          customer_name: order.customer_name || 'Customer',
          customer_phone: order.customer_phone || '',
          special_instructions: order.special_instructions || '',
          subtotal: order.subtotal,
          tax_amount: order.tax_amount,
          total_amount: order.total_amount,
          payment_status: order.payment_status || 'pending',
          created_at: order.created_at,
          updated_at: order.updated_at,
        });

        if (!ordErr && order.items && order.items.length > 0) {
          const itemsPayload = order.items.map(item => ({
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
        console.warn('Supabase order insert fallback:', err);
      }
    }

    // 2. Local resilient store update & instant reactive broadcast
    const orders = this.getOrders(order.cafe_id);
    const existingIdx = orders.findIndex(o => o.id === order.id);
    if (existingIdx >= 0) {
      orders[existingIdx] = order;
    } else {
      orders.unshift(order);
    }
    this.saveOrders(orders, order.cafe_id);

    // Update table status to occupied
    this.updateTableStatus(order.cafe_id, order.table_number, 'occupied', order.id);

    // Broadcast new order to Manager Dashboard
    this.broadcast('NEW_ORDER', order);
    return order;
  }

  public async updateOrderStatus(orderId: string, newStatus: OrderStatus, cafeId: string = 'cafe001'): Promise<IOrder | null> {
    // 1. Supabase update if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .eq('cafe_id', cafeId);
      } catch (err) {
        console.warn('Supabase status update fallback:', err);
      }
    }

    // 2. Local state update
    const orders = this.getOrders(cafeId);
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = newStatus;
    order.updated_at = new Date().toISOString();
    this.saveOrders(orders, cafeId);

    // If served or cancelled, free table
    if (newStatus === 'served' || newStatus === 'cancelled') {
      this.updateTableStatus(cafeId, order.table_number, 'available');
    }

    // Broadcast status change to customer tracking & manager tabs
    this.broadcast('ORDER_STATUS_CHANGED', order);
    return order;
  }

  // --- MENU ITEMS CRUD ---
  public getMenuItems(cafeId: string = 'cafe001'): IMenuItem[] {
    if (typeof window === 'undefined') return defaultMenuItems;
    const key = `cafe_menu_${cafeId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultMenuItems));
      return defaultMenuItems;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultMenuItems;
    }
  }

  public saveMenuItems(items: IMenuItem[], cafeId: string = 'cafe001') {
    if (typeof window === 'undefined') return;
    const key = `cafe_menu_${cafeId}`;
    localStorage.setItem(key, JSON.stringify(items));
    this.broadcast('MENU_UPDATED', items);
  }

  public addMenuItem(item: Omit<IMenuItem, 'id'>, cafeId: string = 'cafe001'): IMenuItem {
    const items = this.getMenuItems(cafeId);
    const newItem: IMenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      cafe_id: cafeId,
      created_at: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.saveMenuItems(items, cafeId);
    return newItem;
  }

  public updateMenuItem(updated: IMenuItem, cafeId: string = 'cafe001'): IMenuItem {
    const items = this.getMenuItems(cafeId);
    const idx = items.findIndex(i => i.id === updated.id);
    if (idx >= 0) {
      items[idx] = updated;
      this.saveMenuItems(items, cafeId);
    }
    return updated;
  }

  public toggleItemAvailability(itemId: string, cafeId: string = 'cafe001'): boolean {
    const items = this.getMenuItems(cafeId);
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.is_available = !item.is_available;
      this.saveMenuItems(items, cafeId);
      return item.is_available;
    }
    return false;
  }

  public deleteMenuItem(itemId: string, cafeId: string = 'cafe001') {
    const items = this.getMenuItems(cafeId).filter(i => i.id !== itemId);
    this.saveMenuItems(items, cafeId);
  }

  // --- TABLES ACCESS ---
  public getTables(cafeId: string = 'cafe001'): ICafeTable[] {
    if (typeof window === 'undefined') return defaultTables;
    const key = `cafe_tables_${cafeId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultTables));
      return defaultTables;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultTables;
    }
  }

  public saveTables(tables: ICafeTable[], cafeId: string = 'cafe001') {
    if (typeof window === 'undefined') return;
    const key = `cafe_tables_${cafeId}`;
    localStorage.setItem(key, JSON.stringify(tables));
    this.broadcast('TABLES_UPDATED', tables);
  }

  public addTable(tableNumber: string, capacity: number = 4, cafeId: string = 'cafe001'): ICafeTable {
    const tables = this.getTables(cafeId);
    const newTbl: ICafeTable = {
      id: `tbl-${Date.now()}`,
      cafe_id: cafeId,
      table_number: tableNumber.toUpperCase(),
      capacity,
      status: 'available',
    };
    tables.push(newTbl);
    this.saveTables(tables, cafeId);
    return newTbl;
  }

  public updateTableStatus(cafeId: string, tableNumber: string, status: 'available' | 'occupied' | 'reserved', activeOrderId?: string) {
    const tables = this.getTables(cafeId);
    const tbl = tables.find(t => t.table_number.toLowerCase() === tableNumber.toLowerCase());
    if (tbl) {
      tbl.status = status;
      tbl.active_order_id = activeOrderId;
      this.saveTables(tables, cafeId);
    }
  }

  // --- REPORTS CALCULATION ---
  public getSalesReport(cafeId: string = 'cafe001'): ISalesReport {
    const orders = this.getOrders(cafeId);
    const nonCancelled = orders.filter(o => o.status !== 'cancelled');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.created_at.startsWith(todayStr));
    const todaySales = todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing' || o.status === 'accepted').length;
    const completedCount = orders.filter(o => o.status === 'served').length;

    // Item popularity map
    const itemMap: Record<string, { count: number; revenue: number }> = {};
    nonCancelled.forEach(o => {
      o.items.forEach(it => {
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

    // Last 7 days trends
    const daily_trends = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dStr = d.toISOString().split('T')[0];
      const dayOrders = nonCancelled.filter(o => o.created_at.startsWith(dStr));
      const daySales = dayOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      // Add baseline for demo aesthetics if no orders that day
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
    const avgOrderVal = nonCancelled.length > 0 ? (todaySales / (todayOrders.length || 1)) : 450;

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
  }
}

export const dataStore = new CafeDataStore();
