import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Permitir acceso a la página de login
  if (path === '/auth/login') {
    return NextResponse.next();
  }

  // Verificar si existe userRole en localStorage
  const userRole = request.cookies.get('userRole');
  
  if (!userRole) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verificar rutas permitidas según el rol
  const ALLOWED_ROUTES = {
    usuario: ['/user'],
    admin: ['/admin', '/shared'],
    enterprise: ['/enterprise', '/shared']
  };

  const role = userRole.value;
  const allowedPaths = ALLOWED_ROUTES[role as keyof typeof ALLOWED_ROUTES];

  if (!allowedPaths?.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/enterprise/:path*',
    '/shared/:path*'
  ]
};