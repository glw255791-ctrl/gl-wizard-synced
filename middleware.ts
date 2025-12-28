// middleware.ts
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

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value; // Supabase session cookie

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/general-analysis/:path*",
    "/reversal-analysis/:path*",
    "/reversal-reclassification-analysis/:path*",
    "/user-management/:path*",
    "/user-manual/:path*",
    "/about/:path*",
  ],
};
