import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { API, API_TOKEN } from './utils/apiUtils';

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/recovery', '/forgot-password'];
const PRIVATE_PATHS = ['/user'];
const ADMIN_PATHS = ['/admin'];

const getUser = async () => {
  const response = await fetch(`${API}/user/me`, {
    mode: 'cors',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      // cookie: `jwt=${token}; refreshToken=${refreshToken}`,
    },
  });

  return await response.json();
};

const getRefreshToken = async () => {
  const response = await fetch(`${API}/user/refresh`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      // cookie: `jwt=${token}; refreshToken=${refreshToken}`,
    },
  });

  return await response.json();
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = PUBLIC_PATHS.includes(path);
  const isPrivatePath = PRIVATE_PATHS.some((privatePath) => path.startsWith(privatePath));
  const isAdminPath = ADMIN_PATHS.some((adminPath) => path.startsWith(adminPath));

  const token = request.cookies.get('jwt');
  // const refreshToken = request.cookies.get('refreshToken');

  if (isPublicPath && !!token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (isPrivatePath && !token) {
    const url = new URL('/sign-in', request.nextUrl);

    if (path !== '/') {
      url.searchParams.set('redirect', path);
    }
    return NextResponse.redirect(url);
  }

  if (isAdminPath) {
    try {
      const user = await getUser();

      if (user.error) {
        throw new Error(user.error.message);
      }

      if (!user.roles.includes('admin')) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
      }
    } catch {
      const data = await getRefreshToken();

      if (data.error) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
      }

      if (data.accessToken) {
        const user = await getUser();

        if (user.error) {
          throw new Error(data.error.message);
        }

        if (!user.roles.includes('admin')) {
          return NextResponse.redirect(new URL('/', request.nextUrl));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/recovery',
    '/forgot-password',
    '/admin',
    '/admin/(.*)',
    '/user/(.*)',
  ],
};
