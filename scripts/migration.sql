-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  gradient TEXT NOT NULL DEFAULT ''
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  specs JSONB NOT NULL DEFAULT '[]',
  price REAL NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  "categorySlug" TEXT NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
  stock INTEGER NOT NULL DEFAULT 0
);

-- Create carousel_slides table
CREATE TABLE IF NOT EXISTS carousel_slides (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0
);

-- Disable RLS (server-side app, no direct client access)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides DISABLE ROW LEVEL SECURITY;
