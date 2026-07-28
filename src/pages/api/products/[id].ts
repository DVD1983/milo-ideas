import type { APIRoute } from 'astro';
import { getProductById, updateProduct, deleteProduct } from '../../../lib/storage';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const product = await getProductById(id);
  if (!product) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const body = await request.json();
    const product = await updateProduct(id, body);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al actualizar el producto' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};