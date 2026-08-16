export { auth as middleware } from "@/auth";

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
