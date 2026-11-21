# The Shawarma Palace Cafe — Premium QR-Based Smart Cafe Platform

A production-ready, modern, scalable QR-based food ordering and restaurant management platform designed for cafes across India. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase PostgreSQL with real-time updates.

---

## 🌟 Executive Overview & Key Interfaces

The platform features two dedicated interfaces tailored for their specific device form-factors:

1. **Customer Ordering Website (Mobile-First)**:
   - Scans table QR code (e.g. `/menu?cafe=cafe001&table=T01`)
   - Auto-identifies cafe ID and table number
   - Displays welcoming branding: *"Welcome to The Shawarma Palace Cafe" • "Enjoy your dining experience!"*
   - Showcases authentic uploaded cafe photography (Storefront, Ambiance, Booths, Founder, 3D Wall Logo, and Signature Rose Milk)
   - 8 distinct food categories: **Starters, Main Course, Pizza, Burgers, Sandwiches, Pasta, Beverages, Desserts**
   - Pure Veg (green square) & Non-Veg (red triangle) Indian FSSAI indicators
   - Quantity (+ / -) controls, special cooking instructions (*"Less spicy", "No onion"*), 5% restaurant GST breakdown
   - Accidental duplicate order prevention with idempotency locking
   - Live Order Tracking (`/track-order`) with animated 5-step kitchen progression synchronized in real time

2. **Cafe Manager Dashboard (Desktop-First)**:
   - Route: `/manager/login` (with 1-Click Instant Demo Login or PIN `1234`)
   - Route: `/manager/dashboard`
   - Real-time Live Orders pipeline with Supabase Realtime + Broadcast synchronization
   - Web Audio API notification chime whenever a new order arrives
   - Order management workflow: **Accept Order → Start Preparing → Mark as Ready → Mark as Served → Cancel**
   - Instant 80mm thermal receipt & Kitchen Order Ticket (KOT) printing
   - Menu Management: Add/edit/delete dishes, update INR prices, category assignment, 1-click In-Stock / Sold-Out (86) toggle
   - Table QR Code Generator: Unique QR codes per table (`T01` to `T10`), PNG downloads, and printable Table Tent Cards
   - Analytics & Financial Reports: Today's sales, weekly trends, monthly run-rate, top 5 bestsellers, and CSV export

---

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom luxury cafe palette (Dark Coffee, Warm Cream, Beige, Amber Gold, Forest Green)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Real-Time Engine**: Supabase Realtime + dual-mode resilient local broadcast bus
- **Icons**: Lucide React
- **Visual Charts**: Recharts
- **QR Codes**: `qrcode` vector & canvas generator
- **Audio Synthesizer**: Web Audio API (cross-browser chime without external dependencies)
- **Deployment**: Vercel ready

---

## 📂 Project Structure

```
├── public/
│   └── images/
│       └── cafe/                # 10 uploaded authentic photographs of the cafe & dishes
│           ├── storefront.jpeg        # Illuminated exterior glass facade at night
│           ├── logo_3d.jpeg           # 3D wall logo with rotisserie flames
│           ├── interior_main.jpeg     # Dining lounge with backlit Kyodai emblem & wave ceiling
│           ├── dining_lounge.jpeg     # Guests enjoying hot rolls & snacks
│           ├── dining_friends.jpeg    # Catchups & casual cafe dining
│           ├── booth_cozy.jpeg        # Brick textured wall & designer booth lamps
│           ├── reception_counter.jpeg # POS greeting station & archway
│           ├── accent_wall.jpeg       # Traditional red ideogram accent wall
│           ├── rose_milk.jpeg         # Signature chilled Rose Milk bottle
│           └── founder.jpeg           # Founder & cafe host portrait
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── menu/route.ts          # Menu items API
│   │   │   ├── orders/route.ts        # Order creation & retrieval API
│   │   │   ├── orders/[id]/route.ts   # Order status update API
│   │   │   └── tables/route.ts        # Table management API
│   │   ├── manager/
│   │   │   ├── login/page.tsx         # Secure manager login
│   │   │   └── dashboard/page.tsx     # Full SaaS manager dashboard
│   │   ├── menu/page.tsx              # Customer QR digital menu
│   │   ├── track-order/page.tsx       # Real-time customer order tracking
│   │   ├── globals.css                # Tailwind directives & print styles
│   │   ├── layout.tsx                 # Root layout & providers
│   │   └── page.tsx                   # Premium cafe homepage
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx             # Sticky luxury navbar & table switcher
│   │   │   ├── Footer.tsx             # Contact, address & cafe hours
│   │   │   └── VegBadge.tsx           # Official FSSAI Veg / Non-Veg badges
│   │   ├── customer/
│   │   │   ├── HeroSection.tsx        # Hero with table indicator & CTA
│   │   │   ├── PhotoGallery.tsx       # Ambiance gallery of uploaded photographs
│   │   │   ├── CategorySlider.tsx     # 8 category filter pills
│   │   │   ├── MenuItemCard.tsx       # Food card with quantity controls
│   │   │   ├── CartDrawer.tsx         # Slide-in cart & duplicate prevention
│   │   │   └── OrderStatusTracker.tsx # Animated 5-step live tracker
│   │   └── manager/
│   │       ├── ManagerHeader.tsx      # Top SaaS navigation & sound chime toggle
│   │       ├── LiveOrdersTab.tsx      # Real-time order pipeline & KOT printer
│   │       ├── MenuManagementTab.tsx  # Menu CRUD & availability toggles
│   │       ├── QRCodeManagementTab.tsx# Table QR codes & printable tent stands
│   │       └── ReportsTab.tsx         # Financial metrics & CSV export
│   ├── context/
│   │   ├── CartContext.tsx            # Cart & customer order state
│   │   └── ManagerAuthContext.tsx     # Manager session & demo login
│   ├── lib/
│   │   ├── sound.ts                   # Web Audio API chime synthesizer
│   │   ├── store.ts                   # Dual-mode Supabase + resilient demo store
│   │   ├── supabase.ts                # Supabase client initializer
│   │   └── utils.ts                   # Formatting helpers & ID generator
│   └── types/
│       └── index.ts                   # Complete TypeScript interfaces
└── supabase/
    └── migrations/
        └── 20261121_initial_schema.sql # Complete PostgreSQL schema, RLS & seed data
```

---

## 🗄️ Database Design & Supabase Setup

### 1. Database Tables

The database schema (`supabase/migrations/20261121_initial_schema.sql`) contains:
- `cafes`: Multi-tenant cafe profile with address, GSTIN, tax rate (5%), currency (`₹`), and branding.
- `users`: Manager and staff accounts with hashed passwords and role-based permissions (`manager`, `cashier`, `kitchen`).
- `categories`: Menu categories scoped by `cafe_id` with ordering and active toggles.
- `menu_items`: Food catalog with INR price, veg/non-veg flag, prep time, and tags.
- `cafe_tables`: Tables per cafe (`T01` to `T10`) with capacity and occupancy status.
- `orders`: Master order records linked to `cafe_id` and `table_number` with subtotal, 5% GST tax, and status (`pending`, `accepted`, `preparing`, `ready`, `served`, `cancelled`).
- `order_items`: **Historical snapshots** of item names and prices at order time to ensure historical billing integrity even if menu prices change later.

### 2. Setting Up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20261121_initial_schema.sql` from this codebase, paste its contents into the SQL Editor, and click **Run**.
4. This will create all tables, indexes, Row Level Security (RLS) policies, Realtime publications, and seed the default data for **The Shawarma Palace Cafe** (`cafe001`).
5. In your Supabase Project Settings, copy:
   - **Project URL**
   - **anon / public key**
6. Add them to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

*(Note: If you run the app without Supabase credentials, it automatically activates the built-in Zero-Config In-Memory & BroadcastChannel demo mode so that cafe owners can test it instantly without any database setup!)*

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🧪 Testing the Complete End-to-End Workflow

Open two browser windows side by side:

1. **Window 1 (Customer View)**:
   - Navigate to: `http://localhost:3000/menu?cafe=cafe001&table=T01`
   - Notice the banner: *"Welcome to The Shawarma Palace Cafe • Table T01"*
   - Browse the menu, select items (e.g. *Palace Royal Shawarma Platter* and *Artisanal Rose Milk*)
   - Open Cart, add special instruction (e.g. *"Less spicy, extra garlic mayo"*)
   - Tap **"Place Order"**

2. **Window 2 (Manager View)**:
   - Navigate to: `http://localhost:3000/manager/dashboard` (Sign in or tap **1-Click Demo Login**)
   - **Notice**: Window 2 instantly plays a crystal-clear two-tone chime and highlights the incoming order card for Table T01 with all items, total amount, and cooking notes without refreshing!
   - Click **"1. Accept Order"** → **"2. Start Preparing"**
   - Look back at **Window 1** (Customer Tracking): The status step smoothly transitions to *"Chef Preparing in Kitchen 🔥"* in real time!
   - Click **"3. Mark as Ready"** → **"4. Mark as Served"**
   - Customer screen updates immediately to *"Order Served! Enjoy your Meal 🎉"*.

---

## 🖨️ Generating & Printing QR Codes

1. Log into the Manager Dashboard at `/manager/dashboard`.
2. Click the **"QR & Tables"** tab.
3. You will see all tables (`T01` through `T10`) with their live occupancy status and generated QR codes.
4. Click **"Download"** to save a 400x400 PNG of the QR code.
5. Click **"Print Stand"** to open the printable **Table Tent Card**:
   - Formatted with the cafe logo, table number, scannable QR code, and 3-step ordering instructions.
   - Click **"Print Table Stand Now"** to print directly onto standard tent card paper or acrylic stands!

---

## ☁️ Vercel Deployment Instructions

1. Push your repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-domain.vercel.app`)
   - `NEXT_PUBLIC_DEFAULT_CAFE_ID` (`cafe001`)
5. Click **Deploy**. Vercel will build and deploy the Next.js production bundle in ~60 seconds.

---

## 🔐 Credentials & Quick Demo Access

- **Manager Login Route**: `/manager/login`
- **Demo PIN**: `1234`
- **Default Email**: `manager@shawarmapalace.com`
- **One-Click Login**: Simply tap the **"1-Click Instant Demo Login"** button on the login screen.
