import type { APIContext } from 'astro';

const SESSION_COOKIE = 'milo-ideas-session';
const SESSION_DURATION = 60 * 60 * 4;

function getSecret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'milo2026';
}

function generateToken(): string {
  const buf = new Uint8Array(48);
  crypto.getRandomValues(buf);
  return Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('');
}

async function encodeSession(token: string, username: string): Promise<string> {
  const payload = JSON.stringify({ token, username, exp: Date.now() + SESSION_DURATION * 1000 });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = await hmacSign(encoded);
  return `${encoded}.${signature}`;
}

async function decodeSession(session: string): Promise<{ token: string; username: string; exp: number } | null> {
  try {
    const [encoded, signature] = session.split('.');
    if (!encoded || !signature) return null;

    const expectedSig = await hmacSign(encoded);
    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createSession(username: string): Promise<string> {
  const token = generateToken();
  return await encodeSession(token, username);
}

export async function getSession(context: APIContext): Promise<{ username: string } | null> {
  const cookie = context.cookies.get(SESSION_COOKIE);
  if (!cookie || !cookie.value) return null;
  const session = await decodeSession(cookie.value);
  if (!session) return null;
  return { username: session.username };
}

export function setSessionCookie(context: APIContext, session: string): void {
  const isSecure = new URL(context.request.url).protocol === 'https:';
  context.cookies.set(SESSION_COOKIE, session, {
    path: '/',
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
  });
}

export function clearSessionCookie(context: APIContext): void {
  context.cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function validateCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'milo2026';
  if (!adminUser || !adminPass) return false;
  return username === adminUser && password === adminPass;
}
