import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  // Dashboard: admin only, but the admin login page stays open.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (session?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (session?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Catalog: any signed-in visitor.
  if (pathname.startsWith("/catalog")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Entry gate: skip it once signed in.
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/catalog", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/catalog/:path*", "/admin/:path*"],
};
