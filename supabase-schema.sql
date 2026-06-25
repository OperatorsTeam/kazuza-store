-- =====================================================
-- KAZUZA E-commerce Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'limited')),
  is_visible BOOLEAN DEFAULT true,
  slug TEXT UNIQUE NOT NULL
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('vodafone_cash', 'instapay', 'cod')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes TEXT
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_name TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_visible ON products(is_visible);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

-- Public can read categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Only authenticated users with service role can manage categories
CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================

-- Public can read visible products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Admin policies for products
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Anyone can create orders (checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Only admins can read orders
CREATE POLICY "Only admins can view orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- Only admins can update orders
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- =====================================================
-- REVIEWS POLICIES
-- =====================================================

-- Public can read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_approved = true);

-- Admin can read all reviews
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- Anyone can create reviews (pending approval)
CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Only admins can update reviews (approve/reject)
CREATE POLICY "Only admins can update reviews"
  ON reviews FOR UPDATE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- Only admins can delete reviews
CREATE POLICY "Only admins can delete reviews"
  ON reviews FOR DELETE
  USING (auth.jwt() ->> 'email' IN (
    SELECT unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  ));

-- =====================================================
-- STORAGE BUCKET
-- =====================================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Anyone can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Anyone can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products');

CREATE POLICY "Anyone can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products');

-- =====================================================
-- SAMPLE CATEGORIES (Optional)
-- =====================================================
INSERT INTO categories (name_en, name_ar, slug) VALUES
  ('Hoodies', 'هوديز', 'hoodies'),
  ('T-Shirts', 'تيشيرتات', 't-shirts'),
  ('Pants', 'بناطيل', 'pants'),
  ('Accessories', 'أكسسوارات', 'accessories');
