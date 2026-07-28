import type { APIRoute } from 'astro';
import { getSlideById, updateSlide, deleteSlide } from '../../../lib/storage';

export const GET: APIRoute = async (context) => {
  const id = context.params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slide = await getSlideById(id);
  if (!slide) {
    return new Response(JSON.stringify({ error: 'Slide no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(slide), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async (context) => {
  const id = context.params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json();
    const updated = await updateSlide(id, body);

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Slide no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al actualizar el slide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  const id = context.params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const deleted = await deleteSlide(id);
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Slide no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
