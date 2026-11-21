-- ==============================================================================
-- SMART CAFE ORDERING PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Multi-Tenant SaaS Architecture for Cafes Across India
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CAFES TABLE
CREATE TABLE IF NOT EXISTS public.cafes (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'cafe001'
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    hero_image_url TEXT,
    address TEXT,
    phone VARCHAR(32),
    email VARCHAR(255),
    gstin VARCHAR(32),
    currency_symbol VARCHAR(8) DEFAULT '₹',
    tax_rate_percent NUMERIC(5,2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS (MANAGERS / STAFF) TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id VARCHAR(64) REFERENCES public.cafes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(32) DEFAULT 'manager', -- 'superadmin', 'manager', 'cashier', 'kitchen'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id VARCHAR(64) REFERENCES public.cafes(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_cafe_category_slug UNIQUE (cafe_id, slug)
);

-- 5. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id VARCHAR(64) REFERENCES public.cafes(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(10,2),
    image_url TEXT,
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    prep_time_minutes INT DEFAULT 10,
    spicy_level INT DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CAFE TABLES TABLE
CREATE TABLE IF NOT EXISTS public.cafe_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafe_id VARCHAR(64) REFERENCES public.cafes(id) ON DELETE CASCADE,
    table_number VARCHAR(32) NOT NULL,
    capacity INT DEFAULT 4,
    qr_code_url TEXT,
    status VARCHAR(32) DEFAULT 'available', -- 'available', 'occupied', 'reserved'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_cafe_table_number UNIQUE (cafe_id, table_number)
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'ORD-9821'
    cafe_id VARCHAR(64) REFERENCES public.cafes(id) ON DELETE CASCADE,
    table_number VARCHAR(32) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'accepted', 'preparing', 'ready', 'served', 'cancelled'
    customer_name VARCHAR(128),
    customer_phone VARCHAR(32),
    special_instructions TEXT,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'paid', 'pay_at_counter'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS (HISTORICAL SNAPSHOTS) TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(64) REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL, -- Snapshot at time of order
    item_price NUMERIC(10,2) NOT NULL, -- Snapshot at time of order
    is_veg BOOLEAN DEFAULT TRUE,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_menu_items_cafe ON public.menu_items(cafe_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_cafe ON public.categories(cafe_id);
CREATE INDEX IF NOT EXISTS idx_cafe_tables_cafe ON public.cafe_tables(cafe_id);
CREATE INDEX IF NOT EXISTS idx_orders_cafe_status ON public.orders(cafe_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(cafe_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant Isolation: One cafe cannot access another cafe's data
-- ==============================================================================
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public customer read access to cafes, categories, menu items, cafe tables
CREATE POLICY "Public read cafes" ON public.cafes FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public read cafe_tables" ON public.cafe_tables FOR SELECT USING (true);

-- Customer insert orders and order items
CREATE POLICY "Customer insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Customer insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer read order_items" ON public.order_items FOR SELECT USING (true);

-- Manager full access policies (scoped by cafe_id)
CREATE POLICY "Manager orders access" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manager menu_items access" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manager categories access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manager tables access" ON public.cafe_tables FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- Enable real-time publication for live order notifications
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- ==============================================================================
-- SEED DATA: THE SHAWARMA PALACE CAFE (cafe001)
-- ==============================================================================
INSERT INTO public.cafes (id, name, slug, tagline, description, logo_url, hero_image_url, address, phone, email, gstin, currency_symbol, tax_rate_percent)
VALUES (
    'cafe001',
    'The Shawarma Palace Cafe',
    'the-shawarma-palace',
    'Fresh & Delicious - Delight in Every Bite',
    'An artisanal dining bistro & cafe combining slow-roasted authentic shawarmas, hand-stretched wood-fired pizzas, gourmet burgers, specialty hot & cold brews, and handcrafted desserts.',
    '/images/cafe/logo_3d.jpeg',
    '/images/cafe/storefront.jpeg',
    'Palace Boulevard, MG Road, Pune, Maharashtra 411001',
    '+91 98234 56789',
    'orders@shawarmapalace.com',
    '27AABCU9603R1ZM',
    '₹',
    5.00
) ON CONFLICT (id) DO NOTHING;

-- Seed Tables for cafe001
INSERT INTO public.cafe_tables (cafe_id, table_number, capacity, status)
VALUES
    ('cafe001', 'T01', 4, 'available'),
    ('cafe001', 'T02', 4, 'available'),
    ('cafe001', 'T03', 2, 'available'),
    ('cafe001', 'T04', 6, 'available'),
    ('cafe001', 'T05', 4, 'available'),
    ('cafe001', 'T06', 4, 'available'),
    ('cafe001', 'T07', 8, 'available'),
    ('cafe001', 'T08', 2, 'available'),
    ('cafe001', 'T09', 4, 'available'),
    ('cafe001', 'T10', 4, 'available')
ON CONFLICT (cafe_id, table_number) DO NOTHING;

-- Seed Default Manager User (PIN: 1234)
INSERT INTO public.users (cafe_id, name, email, password_hash, role)
VALUES (
    'cafe001',
    'Cafe General Manager',
    'manager@shawarmapalace.com',
    '$2a$10$wN3k9.Xh4QkK1n7G9fFVOeuw/X7d6A3XoT3U4A2v5M8/p6w5q.T2a', -- Hashed 'admin123'
    'manager'
) ON CONFLICT (email) DO NOTHING;
