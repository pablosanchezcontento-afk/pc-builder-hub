import { NextRequest, NextResponse } from 'next/server';

// Supported languages
const locales = ['en', 'es', 'pt'];
const defaultLocale = 'en';

// Detect user's preferred language from Accept-Language header
function getUserLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (!acceptLanguage) return defaultLocale;
  
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.split('=')[1] || '1');
      return { code: code.toLowerCase().split('-')[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // Find first matching supported locale
  for (const { code } of languages) {
    if (locales.includes(code)) {
      return code;
    }
  }
  
  return defaultLocale;
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

  // If no locale in pathname, redirect to user's preferred locale
  if (!pathnameHasLocale) {
    const locale = getUserLocale(request);
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
