import createMiddleware from 'next-intl/middleware';
import {routing} from './routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Static files (_next, images, etc.)
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
    // Always match the root
    '/'
  ]
};
