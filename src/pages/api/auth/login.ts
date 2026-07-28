import type { APIRoute } from 'astro';
import { createSession, setSessionCookie, validateCredentials } from '../../../lib/auth';

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Usuario y contraseña requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!validateCredentials(username, password)) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = await createSession(username);
    setSessionCookie(context, session);

    return new Response(JSON.stringify({ success: true, username }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud', detail: msg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};