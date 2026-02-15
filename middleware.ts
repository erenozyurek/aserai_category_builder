import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/auth"];

// SHA-256 hash of the current password
const VALID_HASH =
    "7b833b2d390fab77929e3b3399863ea7dea87e3035e79103943db487b733ff51";

// Pre-computed AUTH_TOKEN (SHA-256 of "aserai-auth-{VALID_HASH}")
// This is the expected cookie value for valid authentication
const AUTH_TOKEN =
    "2ade488b435af15d356e6fedb77c95a2ddac3cf446a1983e4c4fc487630085a9";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths (login page and auth API routes)
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        // If user is already authenticated and tries to access /login, redirect to home
        const authCookie = request.cookies.get("aserai_auth");
        if (pathname === "/login" && authCookie?.value === AUTH_TOKEN) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Check auth cookie exists and matches current valid token
    const authCookie = request.cookies.get("aserai_auth");

    if (!authCookie || authCookie.value !== AUTH_TOKEN) {
        // Invalid, missing, or expired token - redirect to login
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Valid token - allow access
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
