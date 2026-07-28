import type { Product, Category, CarouselSlide } from './productos'

interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Category
        Update: Partial<Category>
      }
      products: {
        Row: Product
        Insert: Product
        Update: Partial<Product>
      }
      carousel_slides: {
        Row: CarouselSlide
        Insert: CarouselSlide
        Update: Partial<CarouselSlide>
      }
    }
  }
}

export type { Database }
