// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/general-analysis",
  "/reversal-analysis",
  "/reversal-reclassification-analysis",
  "/user-management",
  "/user-manual",
  "/about",
];

export function proxy(req: NextRequest) {
  console.log(">>> PROXY INVOKED <<<"); // Should appear in logs
  const token = req.cookies.get("sb-access-token")?.value;
  const pathname = req.nextUrl.pathname;
  console.log("Proxy triggered for path:", req.nextUrl.pathname);
  console.log("Token present:", !!req.cookies.get("sb-access-token")?.value);

  // Redirect root "/" to /login if no token
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect specific routes
  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // ← Critical: include root to handle redirects from home
    "/dashboard/:path*",
    "/general-analysis/:path*",
    "/reversal-analysis/:path*",
    "/reversal-reclassification-analysis/:path*",
    "/user-management/:path*",
    "/user-manual/:path*",
    "/about/:path*",
  ],
};
