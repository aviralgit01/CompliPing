import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function checkSessionExistMiddleware(
    request: NextRequest,
    token: string
) {
    try {
        const sessionToken = await prisma.userSession.count({
            where: {
                sessionToken: token,
            },
        });

        if (sessionToken === 0) {
            const response = NextResponse.redirect(new URL('/login', request.url));

            // Expire cookie
            response.cookies.set('token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
                expires: new Date(0),
            });

            return response;
        }

        return NextResponse.next();
    } catch (error) {
        // console.error("❌ Error in token middleware:", error);

        return NextResponse.redirect(new URL('/login', request.url));
    }
}
