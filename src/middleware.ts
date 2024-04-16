
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY)


export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value
    const path = request.nextUrl.pathname

    if (!token && !isPublicRoute(path)) {
        // Token is missing and trying to access a protected page
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Verify the JWT token
        if (token) {
            const { payload } = await jwtVerify(token, JWT_SECRET, {
                algorithms: ['HS256']
            });
            // Token is valid, allow access
            return NextResponse.next()
        }

    } catch (error) {
        // Token verification failed
        console.error('Token verification failed:', error)

        if (!isPublicRoute(path)) {
            // Redirect to login page if trying to access a protected route
            return NextResponse.redirect(new URL('/login', request.url))
        } else {
            // Allow access to public routes
            return NextResponse.next()
        }
    }
}

function isPublicRoute(path: string) {
    const publicRoutes = ['/login', '/signup', '/password-reset'];
    return publicRoutes.includes(path);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
