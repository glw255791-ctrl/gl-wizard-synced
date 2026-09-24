import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isLicenceExpired } from "@/lib/licence";

const protectedRoutes = [
  "/dashboard",
  "/general-analysis",
  "/reversal-analysis",
  "/reversal-reclassification-analysis",
  "/user-management",
  "/user-manual",
  "/about",
];

function isProtected(pathname: string) {
  return (
    pathname === "/" ||
    protectedRoutes.some((path) => pathname.startsWith(path))
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!isProtected(pathname)) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, licence_valid_until")
    .eq("id", session.user.id)
    .single();

  if (
    profile &&
    profile.role !== "admin" &&
    isLicenceExpired(profile.licence_valid_until)
  ) {
    return NextResponse.redirect(new URL("/licence-expired", request.url));
  }

  return response;
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
