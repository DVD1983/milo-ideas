import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

export const GET: APIRoute = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ authenticated: true, username: session.username }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};