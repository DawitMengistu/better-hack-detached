import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  console.log("🔥 [MATCHES API] GET request received");

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    console.log("📝 [MATCHES API] Request params:", { userId });

    if (!userId) {
      console.log("❌ [MATCHES API] Missing userId parameter");
      return NextResponse.json(
        { error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    // Get user's matches
    console.log("🔍 [MATCHES API] Fetching matches for user:", userId);
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("📊 [MATCHES API] Found", matches.length, "matches");

    // Transform matches to include the other user's info
    const transformedMatches = matches.map((match) => ({
      id: match.id,
      createdAt: match.createdAt,
      otherUser: match.userId1 === userId ? match.user2 : match.user1,
    }));
    console.log(
      "🔄 [MATCHES API] Transformed matches:",
      transformedMatches.map((m) => ({ id: m.id, otherUser: m.otherUser.name }))
    );

    const response = {
      success: true,
      matches: transformedMatches,
    };
    console.log(
      "📤 [MATCHES API] Sending response with",
      transformedMatches.length,
      "matches"
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [MATCHES API] Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
