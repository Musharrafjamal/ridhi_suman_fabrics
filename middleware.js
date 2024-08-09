"use server";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request) {
  try {
    const token = await getToken({ req: request, secret });
    const url = request.nextUrl;

    const res = NextResponse.next();

    res.headers.set("x-url", url.origin);

    // Add CORS headers
    // res.headers.append("Access-Control-Allow-Credentials", "true");
    // res.headers.append(
    //   "Access-Control-Allow-Origin",
    //   "https://www.ridhisumanfabrics.com"
    // );
    // res.headers.append(
    //   "Access-Control-Allow-Methods",
    //   "GET,DELETE,PATCH,POST,PUT,OPTIONS"
    // );
    // res.headers.append(
    //   "Access-Control-Allow-Headers",
    //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    // );

    // if (request.method === "OPTIONS") {
    //   return res;
    // }

    const allowedPaths = ["/", "/products", "/sets", "/category"];
    const isAllowedPath = allowedPaths.some((path) =>
      url.pathname.startsWith(path)
    );

    if (
      !token &&
      (url.pathname.startsWith("/my-orders/:path*") ||
        url.pathname.startsWith("/wishlist/:path*") ||
        url.pathname.startsWith("/profile/:path*"))
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to login if no token and trying to access restricted paths
    if (!token && !isAllowedPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to login if no token and trying to access admin or user paths
    if (
      !token &&
      (url.pathname.startsWith("/admin") || url.pathname.startsWith("/user"))
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from login page
    if (token && url.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect authenticated users away from forgot-password page
    if (token && url.pathname.startsWith("/forgot-password")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect users with role "user" away from admin pages
    if (token && token.role === "user" && url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect users with role "admin" away from user-specific pages
    if (token && token.role === "admin" && url.pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/sets/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/profile",
    "/wishlist",
    "/my-orders",
    "/user/:path*",
    "/admin/:path*",
  ],
};
