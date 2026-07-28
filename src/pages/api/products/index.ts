import type { APIRoute } from 'astro';
import { getAllProducts, createProduct } from '../../../lib/storage';

export const GET: APIRoute = async () => {
  const products = await getAllProducts();
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { id, name, description, specs, price, image, categorySlug, stock } = body;

    if (!id || !name || !categorySlug) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos (id, name, categorySlug)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await getAllProducts();
    if (existing.find(p => p.id === id)) {
      return new Response(JSON.stringify({ error: `Ya existe un producto con el id '${id}'` }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const product = await createProduct({
      id,
      name,
      description: description || '',
      specs: specs || [],
      price: Number(price) || 0,
      image: image || 'https://placehold.co/400x400/ccc/ffffff?text=Producto',
      categorySlug,
      stock: stock !== undefined ? Number(stock) : 0,
    });

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al crear el producto' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};