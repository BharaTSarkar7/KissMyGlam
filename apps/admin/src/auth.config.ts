import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/inventory",
        "/products",
        "/analytics",
        "/categories",
        "/dashboard",
      ];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      // If logged in and visiting /login, redirect to inventory
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/inventory", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
