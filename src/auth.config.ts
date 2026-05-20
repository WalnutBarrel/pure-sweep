import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = ["OWNER", "ADMIN", "STAFF"].includes(auth?.user?.role || "");
      const isDashboardPage = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname.startsWith("/login");

      if (isDashboardPage) {
        if (isLoggedIn && isAdmin) return true;
        return Response.redirect(
          new URL(
            `/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`,
            nextUrl
          )
        );
      }

      if (isLoginPage) {
        if (isLoggedIn) {
          if (isAdmin) {
            return Response.redirect(new URL("/admin/dashboard", nextUrl));
          }
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "CUSTOMER";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
};
