export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (Auth.js handles these itself)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc.
     */
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
