import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "linkedin", "wakatime"],
      allowDifferentEmails: true,
      updateUserInfoOnLink: true,
      allowUnlinkingAll: false,
    },
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
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      scope: ["openid", "profile", "email"],
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "wakatime",
          clientId: process.env.WAKATIME_CLIENT_ID as string,
          clientSecret: process.env.WAKATIME_CLIENT_SECRET as string,
          authorizationUrl: "https://wakatime.com/oauth/authorize",
          tokenUrl: "https://wakatime.com/oauth/token",
          userInfoUrl: "https://wakatime.com/api/v1/users/current",
          scopes: ["read_summaries"],
          redirectURI: `${
            process.env.BETTER_AUTH_URL || "http://localhost:3000"
          }/api/auth/callback/wakatime`,
        },
      ],
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Add debugging
  logger: {
    level: "debug",
    disabled: false,
  },
});
