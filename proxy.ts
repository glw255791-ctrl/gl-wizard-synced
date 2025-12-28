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
  console.log(">>> PROXY INVOKED <<<");
  const pathname = req.nextUrl.pathname;
  console.log("Path:", pathname);

  // Update this line with your actual project ref
  const token = req.cookies.get("sb-vhqrolkbkaojskbspwpi-auth-token")?.value;
  console.log("Token present:", !!token);

  // Rest of your logic (root redirect + protected routes)
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/general-analysis/:path*",
    "/reversal-analysis/:path*",
    "/reversal-reclassification-analysis/:path*",
    "/user-management/:path*",
    "/user-manual/:path*",
    "/about/:path*",
  ],
};
