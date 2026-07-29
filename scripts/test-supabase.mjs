import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8').split('\n').filter(Boolean).reduce((a, l) => {
  const [k, ...v] = l.split('='); a[k.trim()] = v.join('=').trim(); return a;
}, {});

const sup = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const sql = `CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  gradient TEXT NOT NULL DEFAULT ''
);
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
CREATE TABLE IF NOT EXISTS carousel_slides (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides DISABLE ROW LEVEL SECURITY;`;

// Try via raw fetch to Supabase pg endpoint
async function t() {
  const r = await fetch(env.SUPABASE_URL + '/rest/v1/rpc/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': 'Bearer ' + env.SUPABASE_SERVICE_ROLE_KEY
    },
    body: JSON.stringify({})
  });
  console.log('rpc list:', r.status, await r.text());
  
  // Try direct database query
  const { data, error } = await sup.from('_prisma_migrations').select('*');
  console.log('prisma:', data, error?.message);
}
t().catch(console.error);
