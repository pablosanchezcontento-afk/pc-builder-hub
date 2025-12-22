import { NextRequest, NextResponse } from 'next/server';

// Supported languages
const locales = ['en', 'es', 'pt'];
const defaultLocale = 'en';

// Get locale from pathname (e.g., /es/page -> es)
function getLocale(pathname: string): string {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  return locales.includes(firstSegment) ? firstSegment : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.') // other static files
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in pathname, redirect to default locale
  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except those starting with:
    // - _next/static
    // - _next/image
    // - favicon.ico
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
