import { defineMiddleware } from 'astro:middleware';
import { getSession } from './lib/auth';

const publicRoutes = [
  '/',
  '/productos/',
  '/images/',
  '/_astro/',
  '/favicon.ico',
  '/api/auth/login',
];

const apiRoutes = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/products',
  '/api/categories',
  '/api/carousel',
  '/api/upload',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith(r));
  const isAdminPage = pathname.startsWith('/admin');
  const isApiRoute = pathname.startsWith('/api');

  if (isAdminPage && pathname !== '/admin/login') {
    const session = await getSession(context);
    if (!session) {
      return context.redirect('/admin/login');
    }
  }

  if (isApiRoute && !isPublic) {
    const session = await getSession(context);
    if (!session) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});