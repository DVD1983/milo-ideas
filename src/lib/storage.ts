import { supabase } from './supabase'
import type { Product, Category, CarouselSlide } from '../data/productos'
import { isSeeded, markSeeded, getCached, setCache, clearCache } from './cache'
import seedData from '../data/productos.json'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.resolve(__dirname, '../../src/data/productos.json')

type StoreData = {
  categories: Category[]
  products: Product[]
  carouselSlides: CarouselSlide[]
}

function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY))
}

function readJsonFile(): StoreData {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return seedData as StoreData
  }
}

function writeJsonFile(data: StoreData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch {}
}

async function ensureSeeded(): Promise<void> {
  if (!isSupabaseConfigured() || isSeeded()) return
  try {
    const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true })
    if (count && count > 0) { markSeeded(); return }
  } catch (e) {
    console.error('ensureSeeded check failed:', e)
    return
  }
  try {
    await supabase.from('categories').upsert(seedData.categories, { onConflict: 'slug' })
    await supabase.from('products').upsert(seedData.products as never[], { onConflict: 'id' })
    const slides = (seedData as StoreData).carouselSlides
    if (slides) await supabase.from('carousel_slides').upsert(slides, { onConflict: 'id' })
    markSeeded()
  } catch (e) {
    console.error('ensureSeeded insert failed:', e)
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<Product[]>('products')
    if (cached) return cached
    const { data } = await supabase.from('products').select('*')
    const result = (data || []) as Product[]
    setCache('products', result)
    return result
  }
  return readJsonFile().products
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<Product | null>(`product:${id}`)
    if (cached !== null) return cached
    const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
    const result = data as Product | null
    setCache(`product:${id}`, result)
    return result
  }
  const products = readJsonFile().products
  return products.find(p => p.id === id) || null
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<Product[]>(`products:category:${slug}`)
    if (cached) return cached
    const { data } = await supabase.from('products').select('*').eq('categorySlug', slug)
    const result = (data || []) as Product[]
    setCache(`products:category:${slug}`, result)
    return result
  }
  return readJsonFile().products.filter(p => p.categorySlug === slug)
}

export async function createProduct(product: Product): Promise<Product> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('products').insert(product).select().single()
    clearCache()
    return data as Product
  }
  const data = readJsonFile()
  data.products.push(product)
  writeJsonFile(data)
  return product
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('products').update(updates).eq('id', id).select().single()
    clearCache()
    return data as Product | null
  }
  const data = readJsonFile()
  const idx = data.products.findIndex(p => p.id === id)
  if (idx === -1) return null
  data.products[idx] = { ...data.products[idx], ...updates }
  writeJsonFile(data)
  return data.products[idx]
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) clearCache()
    return !error
  }
  const data = readJsonFile()
  const len = data.products.length
  data.products = data.products.filter(p => p.id !== id)
  if (data.products.length === len) return false
  writeJsonFile(data)
  return true
}

export async function getAllCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<Category[]>('categories')
    if (cached) return cached
    const { data } = await supabase.from('categories').select('*')
    const result = (data || []) as Category[]
    setCache('categories', result)
    return result
  }
  return readJsonFile().categories
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<Category | null>(`category:${slug}`)
    if (cached !== null) return cached
    const { data } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle()
    const result = data as Category | null
    setCache(`category:${slug}`, result)
    return result
  }
  return readJsonFile().categories.find(c => c.slug === slug) || null
}

export async function createCategory(category: Category): Promise<Category> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('categories').insert(category).select().single()
    clearCache()
    return data as Category
  }
  const data = readJsonFile()
  data.categories.push(category)
  writeJsonFile(data)
  return category
}

export async function updateCategory(slug: string, updates: Partial<Category>): Promise<Category | null> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('categories').update(updates).eq('slug', slug).select().single()
    clearCache()
    return data as Category | null
  }
  const data = readJsonFile()
  const idx = data.categories.findIndex(c => c.slug === slug)
  if (idx === -1) return null
  data.categories[idx] = { ...data.categories[idx], ...updates }
  writeJsonFile(data)
  return data.categories[idx]
}

export async function deleteCategory(slug: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('categories').delete().eq('slug', slug)
    if (!error) clearCache()
    return !error
  }
  const data = readJsonFile()
  const len = data.categories.length
  data.categories = data.categories.filter(c => c.slug !== slug)
  if (data.categories.length === len) return false
  writeJsonFile(data)
  return true
}

export async function getAllSlides(): Promise<CarouselSlide[]> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<CarouselSlide[]>('slides')
    if (cached) return cached
    const { data } = await supabase.from('carousel_slides').select('*').order('order')
    const result = (data || []) as CarouselSlide[]
    setCache('slides', result)
    return result
  }
  return (readJsonFile().carouselSlides || []).sort((a, b) => a.order - b.order)
}

export async function getSlideById(id: string): Promise<CarouselSlide | null> {
  if (isSupabaseConfigured()) {
    await ensureSeeded()
    const cached = getCached<CarouselSlide | null>(`slide:${id}`)
    if (cached !== null) return cached
    const { data } = await supabase.from('carousel_slides').select('*').eq('id', id).maybeSingle()
    const result = data as CarouselSlide | null
    setCache(`slide:${id}`, result)
    return result
  }
  return (readJsonFile().carouselSlides || []).find(s => s.id === id) || null
}

export async function createSlide(slide: CarouselSlide): Promise<CarouselSlide> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('carousel_slides').insert(slide).select().single()
    clearCache()
    return data as CarouselSlide
  }
  const data = readJsonFile()
  if (!data.carouselSlides) data.carouselSlides = []
  data.carouselSlides.push(slide)
  writeJsonFile(data)
  return slide
}

export async function updateSlide(id: string, updates: Partial<CarouselSlide>): Promise<CarouselSlide | null> {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('carousel_slides').update(updates).eq('id', id).select().single()
    clearCache()
    return data as CarouselSlide | null
  }
  const data = readJsonFile()
  if (!data.carouselSlides) return null
  const idx = data.carouselSlides.findIndex(s => s.id === id)
  if (idx === -1) return null
  data.carouselSlides[idx] = { ...data.carouselSlides[idx], ...updates }
  writeJsonFile(data)
  return data.carouselSlides[idx]
}

export async function deleteSlide(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('carousel_slides').delete().eq('id', id)
    if (!error) clearCache()
    return !error
  }
  const data = readJsonFile()
  if (!data.carouselSlides) return false
  const len = data.carouselSlides.length
  data.carouselSlides = data.carouselSlides.filter(s => s.id !== id)
  if (data.carouselSlides.length === len) return false
  writeJsonFile(data)
  return true
}
