import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/inventory/:path*",
    "/products/:path*",
    "/analytics/:path*",
    "/categories/:path*",
    "/dashboard/:path*",
    "/login",
  ],
};
