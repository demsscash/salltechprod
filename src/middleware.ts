import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
    // Ne vérifier l'authentification que pour les routes admin
    if (!req.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à la route admin
    if (!session) {
        const redirectUrl = new URL('/login', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};