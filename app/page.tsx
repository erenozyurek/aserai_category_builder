import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import CategoryDashboard from "@/components/CategoryDashboard";

// Must match the AUTH_TOKEN in /api/auth/verify/route.ts
const VALID_HASH =
  "7b833b2d390fab77929e3b3399863ea7dea87e3035e79103943db487b733ff51";
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
