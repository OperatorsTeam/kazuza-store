# KAZUZA E-commerce - Setup Guide

## 🚀 Quick Start

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Go to SQL Editor and run the entire `supabase-schema.sql` file
4. Create a storage bucket named `products` (should be created by the SQL)

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lapryqtwwzdelxifcouz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcHJ5cXR3d3pkZWx4aWZjb3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjA0ODAsImV4cCI6MjA5Nzg5NjQ4MH0.Awz7r7Y3flJFp9ydNYlgUrTUaOywKq9ZPMz8UyyrMNQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcHJ5cXR3d3pkZWx4aWZjb3V6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMyMDQ4MCwiZXhwIjoyMDk3ODk2NDgwfQ.vL7sFFLKcEc-XoX3LuDY5gCFCHU_VsRxt7PMuozUBiU
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@kazuza.com
```

### 3. Create Admin User

In Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Invite user" or use the signup API
3. Use the email you set in `ADMIN_EMAILS`

### 4. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Language-based routes
│   │   │   ├── layout.tsx     # Locale layout with RTL support
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx    # Products listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Product detail
│   │   │   ├── cart/
│   │   │   │   └── page.tsx    # Shopping cart
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx    # Checkout
│   │   │   └── about/
│   │   │       └── page.tsx    # About page
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin layout with auth
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx    # Products management
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # Add product
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit product
│   │   │   └── orders/
│   │   │       └── page.tsx    # Orders management
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Root redirect
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   ├── home/
│   │   │   ├── hero.tsx
│   │   │   ├── featured-products.tsx
│   │   │   ├── about-preview.tsx
│   │   │   ├── testimonials.tsx
│   │   │   └── instagram.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── loading.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser client
│   │   │   ├── server.ts      # Server client
│   │   │   ├── admin.ts       # Admin client
│   │   │   └── middleware.ts   # Session middleware
│   │   ├── admin.ts           # Admin check
│   │   └── i18n.ts            # Translations
│   ├── store/
│   │   ├── cart.ts            # Cart state (Zustand)
│   │   └── locale.ts          # Language state
│   └── types/
│       └── index.ts           # TypeScript types
├── supabase-schema.sql        # Database schema
├── .env.example
└── SETUP.md
```

---

## 🌍 Features

### Bilingual Support
- Arabic (primary) - RTL layout
- English (secondary) - LTR layout
- Language switcher in navbar
- All content stored in both languages

### Product System
- CRUD via admin panel
- Image upload to Supabase Storage
- Categories with bilingual names
- Stock status (in stock, limited, out of stock)
- Visibility toggle

### Shopping Cart
- Persistent cart (localStorage via Zustand)
- Quantity controls
- Real-time total calculation

### Checkout
- Customer info form
- Payment methods:
  - Cash on Delivery (COD)
  - Vodafone Cash
  - InstaPay
- Order stored in Supabase

### Admin Panel
- Secure authentication
- Dashboard with stats
- Product management (CRUD)
- Order management with status updates
- Review approval system

### Reviews
- Real user submissions
- Admin approval required
- Star ratings
- Display on product pages

---

## 🔐 Security

### Admin Access
Admin access is controlled by:
1. Email whitelist in `ADMIN_EMAILS` environment variable
2. Supabase Row Level Security (RLS) policies
3. Client-side route protection in admin layout

### RLS Policies
- **Products**: Public read, admin write
- **Orders**: Public insert, admin read/update
- **Reviews**: Public read (approved only), public insert (pending), admin manage
- **Categories**: Public read, admin write

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` and `globals.css` to customize the color scheme.

### Fonts
The project uses:
- Inter (Latin)
- Cairo (Arabic)

Change in `src/app/[locale]/layout.tsx`.

### Content
All text is in `src/lib/i18n.ts`. Edit translations there.

---

## 📱 Mobile Support

The UI is fully responsive:
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: Full layout with sidebar (admin)

---

## ⚡ Performance

- Server Components where possible
- Image optimization with Next.js Image
- Lazy loading for below-fold content
- Minimal client-side JavaScript
- Zustand for efficient state management
