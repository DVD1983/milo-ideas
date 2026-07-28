import type { APIRoute } from 'astro';
import { getAllCategories, createCategory } from '../../../lib/storage';

export const GET: APIRoute = async () => {
  const categories = await getAllCategories();
  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { slug, name, image, description, gradient } = body;

    if (!slug || !name) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos (slug, name)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await getAllCategories();
    if (existing.find(c => c.slug === slug)) {
      return new Response(JSON.stringify({ error: `Ya existe una categoría con el slug '${slug}'` }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const category = await createCategory({
      slug,
      name,
      image: image || 'https://placehold.co/400x400/ccc/ffffff?text=Categoria',
      description: description || '',
      gradient: gradient || 'linear-gradient(135deg, #fff1f1, #ffc8c8)',
    });

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al crear la categoría' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};