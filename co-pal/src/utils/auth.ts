import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: [
        "user",
        "user:email",
        "repo",
        "read:org",
        "read:user",
        "user:follow",
      ],
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
