export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name_en: string
          name_ar: string
          description_en: string | null
          description_ar: string | null
          price: number
          images: string[]
          category_id: string | null
          stock_status: 'in_stock' | 'out_of_stock' | 'limited'
          is_visible: boolean
          slug: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name_en: string
          name_ar: string
          slug: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          customer_address: string
          customer_city: string
          items: Json
          total: number
          payment_method: 'vodafone_cash' | 'instapay' | 'cod'
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          user_name: string
          is_approved: boolean
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
    }
  }
}

export interface Product {
  id: string
  created_at: string
  updated_at: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  price: number
  images: string[]
  category_id: string | null
  stock_status: 'in_stock' | 'out_of_stock' | 'limited'
  is_visible: boolean
  slug: string
  categories?: Category
}

export interface Category {
  id: string
  created_at: string
  name_en: string
  name_ar: string
  slug: string
}

export interface Order {
  id: string
  created_at: string
  user_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  customer_address: string
  customer_city: string
  items: OrderItem[]
  total: number
  payment_method: 'vodafone_cash' | 'instapay' | 'cod'
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  notes: string | null
}

export interface OrderItem {
  product_id: string
  name_en: string
  name_ar: string
  price: number
  quantity: number
  image: string | null
}

export interface Review {
  id: string
  created_at: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  user_name: string
  is_approved: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export type Locale = 'en' | 'ar'
