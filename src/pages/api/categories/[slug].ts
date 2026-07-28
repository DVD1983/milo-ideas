import type { APIRoute } from 'astro';
import { getCategoryBySlug, updateCategory, deleteCategory } from '../../../lib/storage';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return new Response(JSON.stringify({ error: 'Categoría no encontrada' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(category), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const body = await request.json();
    const category = await updateCategory(slug, body);
    if (!category) {
      return new Response(JSON.stringify({ error: 'Categoría no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al actualizar la categoría' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const deleted = await deleteCategory(slug);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Categoría no encontrada' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};