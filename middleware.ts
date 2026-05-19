import { NextResponse, type NextRequest } from "next/server";
import {
  PROTECTED_ROUTES,
  ProtectedRoute,
} from "./lib/constants/protected-route";
import jwt from "jsonwebtoken";
import { Role } from "./lib/constants/role";

import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  role: Role;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  // console.log("middleware run", token, pathname);

  const isAuthPage =
    pathname.startsWith("/super-admin/login") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname === "/" ||
    pathname.startsWith("/team-management/invite");

  // Check if route is protected
  const matchedRoute = (Object.keys(PROTECTED_ROUTES) as ProtectedRoute[])
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || pathname.startsWith(route + "/"));

  // Not logged in
  if (matchedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in → decode role
  let userRole: Role | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userRole = decoded.role;

      // console.log(userRole, "---usr role");
    } catch (err) {
      // console.log("error decode");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Role-based access check
  if (matchedRoute && userRole) {
    const allowedRoles = PROTECTED_ROUTES[matchedRoute];

    if (!allowedRoles.includes(userRole)) {
      // Unauthorized → redirect to dashboard (or 403 page)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  //Prevent logged-in users from accessing auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only app routes, exclude:
     * - api
     * - _next (static files)
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
