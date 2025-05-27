// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET_BASE64;
const secret = Buffer.from(SECRET_KEY, 'base64');

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // разрешенные запросы
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/auth/') ||
        pathname.startsWith('/static/') ||
        pathname === '/login' ||
        pathname === '/register'
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    // перенаправляем в /login если нет авторизации
    if (!token) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    try {
        await jwtVerify(token, secret, {
            algorithms: ['HS512']
        });
        return NextResponse.next();
    } catch (err) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
