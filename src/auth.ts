import { headers } from "next/headers";
import { loginRateLimiter } from "@/lib/rate-limit";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days in seconds
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const ip = (await headers()).get("x-forwarded-for") || "unknown";
        if (!loginRateLimiter.check(ip)) throw new Error("Rate limit exceeded. Please try again later.");
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is temporarily locked due to multiple failed login attempts.");
        }

        // Compare passwords
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          if (user.failedLoginAttempts > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: 0, lockedUntil: null },
            });
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          const attempts = (user.failedLoginAttempts || 0) + 1;
          const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: attempts, lockedUntil },
          });
        }

        return null;
      },
    }),
  ],
});

