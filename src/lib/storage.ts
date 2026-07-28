import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Product, Category, CarouselSlide } from '../data/productos';
import seedData from '../data/productos.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../../src/data/productos.json');

type StoreData = {
  categories: Category[];
  products: Product[];
  carouselSlides: CarouselSlide[];
};

function isVercelKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function readJsonFile(): StoreData {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return seedData as StoreData;
  }
}

function writeJsonFile(data: StoreData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

async function seedKvIfEmpty(): Promise<StoreData> {
  try {
    const existing = await kv.get<StoreData>('products');
    if (existing) return existing;
    await kv.set('products', seedData);
    return seedData as StoreData;
  } catch {
    const file = readJsonFile();
    return file;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    return data.products;
  }
  const file = readJsonFile();
  return file.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.id === id) || null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter(p => p.categorySlug === slug);
}

export async function createProduct(product: Product): Promise<Product> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    data.products.push(product);
    await kv.set('products', data);
    return product;
  }
  const data = readJsonFile();
  data.products.push(product);
  writeJsonFile(data);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates };
    await kv.set('products', data);
    return data.products[idx];
  }
  const data = readJsonFile();
  const idx = data.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  data.products[idx] = { ...data.products[idx], ...updates };
  writeJsonFile(data);
  return data.products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    const len = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    if (data.products.length === len) return false;
    await kv.set('products', data);
    return true;
  }
  const data = readJsonFile();
  const len = data.products.length;
  data.products = data.products.filter(p => p.id !== id);
  if (data.products.length === len) return false;
  writeJsonFile(data);
  return true;
}

export async function getAllCategories(): Promise<Category[]> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    return data.categories;
  }
  const file = readJsonFile();
  return file.categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function createCategory(category: Category): Promise<Category> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    data.categories.push(category);
    await kv.set('products', data);
    return category;
  }
  const data = readJsonFile();
  data.categories.push(category);
  writeJsonFile(data);
  return category;
}

export async function updateCategory(slug: string, updates: Partial<Category>): Promise<Category | null> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    const idx = data.categories.findIndex(c => c.slug === slug);
    if (idx === -1) return null;
    data.categories[idx] = { ...data.categories[idx], ...updates };
    await kv.set('products', data);
    return data.categories[idx];
  }
  const data = readJsonFile();
  const idx = data.categories.findIndex(c => c.slug === slug);
  if (idx === -1) return null;
  data.categories[idx] = { ...data.categories[idx], ...updates };
  writeJsonFile(data);
  return data.categories[idx];
}

export async function deleteCategory(slug: string): Promise<boolean> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    const len = data.categories.length;
    data.categories = data.categories.filter(c => c.slug !== slug);
    if (data.categories.length === len) return false;
    await kv.set('products', data);
    return true;
  }
  const data = readJsonFile();
  const len = data.categories.length;
  data.categories = data.categories.filter(c => c.slug !== slug);
  if (data.categories.length === len) return false;
  writeJsonFile(data);
  return true;
}

export async function getAllSlides(): Promise<CarouselSlide[]> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    return (data.carouselSlides || []).sort((a, b) => a.order - b.order);
  }
  const file = readJsonFile();
  return (file.carouselSlides || []).sort((a, b) => a.order - b.order);
}

export async function getSlideById(id: string): Promise<CarouselSlide | null> {
  const slides = await getAllSlides();
  return slides.find(s => s.id === id) || null;
}

export async function createSlide(slide: CarouselSlide): Promise<CarouselSlide> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    if (!data.carouselSlides) data.carouselSlides = [];
    data.carouselSlides.push(slide);
    await kv.set('products', data);
    return slide;
  }
  const data = readJsonFile();
  if (!data.carouselSlides) data.carouselSlides = [];
  data.carouselSlides.push(slide);
  writeJsonFile(data);
  return slide;
}

export async function updateSlide(id: string, updates: Partial<CarouselSlide>): Promise<CarouselSlide | null> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    if (!data.carouselSlides) return null;
    const idx = data.carouselSlides.findIndex(s => s.id === id);
    if (idx === -1) return null;
    data.carouselSlides[idx] = { ...data.carouselSlides[idx], ...updates };
    await kv.set('products', data);
    return data.carouselSlides[idx];
  }
  const data = readJsonFile();
  if (!data.carouselSlides) return null;
  const idx = data.carouselSlides.findIndex(s => s.id === id);
  if (idx === -1) return null;
  data.carouselSlides[idx] = { ...data.carouselSlides[idx], ...updates };
  writeJsonFile(data);
  return data.carouselSlides[idx];
}

export async function deleteSlide(id: string): Promise<boolean> {
  if (isVercelKvConfigured()) {
    const data = await seedKvIfEmpty();
    if (!data.carouselSlides) return false;
    const len = data.carouselSlides.length;
    data.carouselSlides = data.carouselSlides.filter(s => s.id !== id);
    if (data.carouselSlides.length === len) return false;
    await kv.set('products', data);
    return true;
  }
  const data = readJsonFile();
  if (!data.carouselSlides) return false;
  const len = data.carouselSlides.length;
  data.carouselSlides = data.carouselSlides.filter(s => s.id !== id);
  if (data.carouselSlides.length === len) return false;
  writeJsonFile(data);
  return true;
}