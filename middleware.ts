import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths (login page and auth API routes)
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        // If user is already authenticated and tries to access /login, redirect to home
        const authCookie = request.cookies.get("aserai_auth");
        if (pathname === "/login" && authCookie?.value) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Check auth cookie exists
    const authCookie = request.cookies.get("aserai_auth");

    if (!authCookie || !authCookie.value) {
        // Redirect to login page
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Cookie exists — the actual token validation happens in page.tsx (server component)
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, favicon (favicon files)
         * - Files with extensions (static assets like .css, .js, .png, etc.)
         */
        "/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)",
    ],
};
