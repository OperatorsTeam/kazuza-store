# 🔥 KAZUZA — Premium Egyptian Streetwear E-Commerce

A complete production-ready e-commerce platform for **KAZUZA**, a premium Egyptian streetwear brand based in Cairo.

## ⚡ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Full-stack React framework |
| **TypeScript** | Type safety |
| **TailwindCSS v4** | Utility-first styling |
| **Supabase** | Auth, Database, Storage |
| **Framer Motion** | Animations |
| **Zustand** | State management (cart + locale) |
| **Lucide React** | Icons |

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd kazuza
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Storage** and create a bucket named `products` (set to public)

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@kazuza.com
```

### 4. Create Admin User

In Supabase Dashboard → Authentication → Users → **Invite User**  
Use the same email as `ADMIN_EMAILS`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ar` (Arabic).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/                 # 🌍 Bilingual routes (ar/en)
│   │   ├── layout.tsx            # RTL/LTR layout + navbar + footer
│   │   ├── page.tsx              # 🏠 Homepage
│   │   ├── products/
│   │   │   ├── page.tsx           # 🛍️ Products listing
│   │   │   └── [id]/page.tsx      # 📦 Product detail + reviews
│   │   ├── cart/page.tsx          # 🛒 Shopping cart
│   │   ├── checkout/page.tsx      # 💳 Checkout (COD/Vodafone/InstaPay)
│   │   └── about/page.tsx         # ℹ️ Brand story
│   ├── admin/
│   │   ├── layout.tsx            # 🔐 Admin auth + sidebar
│   │   ├── page.tsx              # 📊 Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx           # ✏️ Product management
│   │   │   ├── new/page.tsx       # ➕ Add product
│   │   │   └── [id]/edit/page.tsx # ✏️ Edit product
│   │   └── orders/page.tsx       # 📋 Order management
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # → Redirects to /ar
├── components/
│   ├── layout/                   # Navbar + Footer
│   ├── home/                     # Homepage sections
│   └── ui/                       # Button, Input, Loading
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── i18n.ts                   # 🌍 All translations (AR + EN)
│   └── admin.ts                  # Admin check utility
├── store/
│   ├── cart.ts                   # 🛒 Cart state (Zustand + persist)
│   └── locale.ts                 # 🌍 Language state
└── types/
    └── index.ts                  # TypeScript types
```

---

## 🌍 Bilingual Support

| Feature | Arabic | English |
|---|---|---|
| Direction | RTL ✅ | LTR ✅ |
| Font | Cairo | Inter |
| Language Switcher | ✅ | ✅ |
| All Content | ✅ | ✅ |
| URL Prefix | `/ar` | `/en` |

All product names, descriptions, and UI text are stored in both languages.

---

## 🛒 Features

### Storefront
- ✅ Hero section with CTA
- ✅ Featured products (from Supabase)
- ✅ Category filters
- ✅ Product detail pages with image gallery
- ✅ Shopping cart with quantity controls
- ✅ Checkout with 3 payment methods
- ✅ User reviews (admin-approved)
- ✅ About page
- ✅ Social links (Instagram, Facebook, Phone)

### Admin Panel (`/admin`)
- ✅ Secure authentication
- ✅ Dashboard with stats (products, orders, revenue)
- ✅ Add/edit/delete products
- ✅ Image upload to Supabase Storage
- ✅ Toggle product visibility
- ✅ Order management with status updates
- ✅ Review approval system

### Payment Methods (Egypt-Focused)
- 🟢 **Cash on Delivery (COD)** — Instructions shown
- 🟢 **Vodafone Cash** — Payment number displayed
- 🟢 **InstaPay** — Payment handle displayed

---

## 🗄️ Database Schema

```sql
-- Tables: categories, products, orders, reviews
-- Full RLS policies enabled
-- See supabase-schema.sql for complete schema
```

| Table | Purpose |
|---|---|
| `categories` | Product categories (bilingual) |
| `products` | Products with images, stock status |
| `orders` | Customer orders with items JSON |
| `reviews` | User reviews (approval workflow) |

---

## 🔐 Security

- ✅ Supabase Row Level Security (RLS) on all tables
- ✅ Admin routes protected by auth + email whitelist
- ✅ No secrets exposed to client
- ✅ Environment variables properly used
- ✅ Security headers in Vercel config

---

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or push to GitHub and import in vercel.com
```

Add environment variables in Vercel dashboard under **Settings → Environment Variables**.

---

## 🎨 Design

- Dark aesthetic (pure black + white)
- Minimal + luxury feel
- Smooth animations (Framer Motion)
- Mobile-first responsive design
- Custom scrollbar styling
- Grid pattern backgrounds

---

## 📱 Responsive Breakpoints

| Device | Layout |
|---|---|
| Mobile (< 640px) | Single column, hamburger menu |
| Tablet (640-1024px) | 2-column grid |
| Desktop (> 1024px) | Full layout, sidebar admin |

---

## 📄 License

Private — KAZUZA Brand © 2024
