import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const sessionData = await auth.api.getSession({ headers: request.headers });

  console.log('ms',sessionData)
  const userId = sessionData?.session.userId;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  // Check account table for providerId existence
  const providers = ["github", "linkedin", "wakatime"];
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      providerId: { in: providers },
    },
  });
  const status = {
    github: accounts.some((a: any) => a.providerId === "github"),
    linkedin: accounts.some((a: any) => a.providerId === "linkedin"),
    wakatime: accounts.some((a: any) => a.providerId === "wakatime"),
  };
  return NextResponse.json(status);
}
