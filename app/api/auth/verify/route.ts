import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { cookies } from "next/headers";

// SHA-256 hash of the 15-character access password
const VALID_HASH =
    "b2e30d8122b09b2c9d37da94ab09514c333c517e75e559ff559e1d347f92d796";

// Auth token stored in cookie (derived from hash + secret)
const AUTH_TOKEN = createHash("sha256")
    .update(`aserai-auth-${VALID_HASH}`)
    .digest("hex");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password || typeof password !== "string") {
            return NextResponse.json(
                { success: false, error: "Şifre gereklidir" },
                { status: 400 }
            );
        }

        // Hash the input and compare
        const inputHash = createHash("sha256").update(password).digest("hex");

        if (inputHash !== VALID_HASH) {
            return NextResponse.json(
                { success: false, error: "Geçersiz şifre" },
                { status: 401 }
            );
        }

        // Set auth cookie (httpOnly, 30 days)
        const cookieStore = await cookies();
        cookieStore.set("aserai_auth", AUTH_TOKEN, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Doğrulama hatası" },
            { status: 500 }
        );
    }
}
