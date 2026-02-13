import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import CategoryDashboard from "@/components/CategoryDashboard";

// Must match the AUTH_TOKEN in /api/auth/verify/route.ts
const VALID_HASH =
  "b2e30d8122b09b2c9d37da94ab09514c333c517e75e559ff559e1d347f92d796";
const AUTH_TOKEN = createHash("sha256")
  .update(`aserai-auth-${VALID_HASH}`)
  .digest("hex");

export default async function Home() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("aserai_auth");

  if (!authCookie || authCookie.value !== AUTH_TOKEN) {
    redirect("/login");
  }

  return <CategoryDashboard />;
}
