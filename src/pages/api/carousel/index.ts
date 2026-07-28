import type { APIRoute } from 'astro';
import { getAllSlides, createSlide } from '../../../lib/storage';

export const GET: APIRoute = async () => {
  const slides = await getAllSlides();
  return new Response(JSON.stringify(slides), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { id, image, title, subtitle, order } = body;

    if (!id || !image || !title) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos (id, image, title)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await getAllSlides();
    if (existing.find(s => s.id === id)) {
      return new Response(JSON.stringify({ error: `Ya existe un slide con el id '${id}'` }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slide = await createSlide({
      id,
      image,
      title,
      subtitle: subtitle || '',
      order: order ?? existing.length + 1,
    });

    return new Response(JSON.stringify(slide), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al crear el slide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
