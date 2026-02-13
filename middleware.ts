import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pre-computed AUTH_TOKEN = sha256("aserai-auth-" + VALID_HASH)
// This avoids importing 'crypto' in edge runtime
const AUTH_TOKEN =
    "d1ce8d25f41b38e6f479af2342071d4e164cb433018348fe9af9e86be5c096e5";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip auth check for login page, auth API, static files, and Next.js internals
    if (
        pathname === "/login" ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // Check auth cookie
    const authCookie = request.cookies.get("aserai_auth");

    if (!authCookie || authCookie.value !== AUTH_TOKEN) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
