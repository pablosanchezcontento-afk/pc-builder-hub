import { NextRequest, NextResponse } from 'next/server';
import { i18n, negotiateLocale } from './lib/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = i18n.locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/${negotiateLocale(request.headers.get('accept-language'))}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals and files with an extension.
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
