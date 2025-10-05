import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("🔥 [LIKE API] POST request received");

  try {
    const { userId, likedId } = await request.json();
    console.log("📝 [LIKE API] Request data:", { userId, likedId });

    if (!userId || !likedId) {
      console.log("❌ [LIKE API] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: userId and likedId" },
        { status: 400 }
      );
    }

    if (userId === likedId) {
      console.log("❌ [LIKE API] User trying to like themselves");
      return NextResponse.json(
        { error: "Cannot like yourself" },
        { status: 400 }
      );
    }

    // Check if both users exist in database
    console.log("🔍 [LIKE API] Checking if users exist");
    const [currentUser, likedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: likedId } }),
    ]);

    if (!currentUser || !likedUser) {
      console.log(
        "⚠️ [LIKE API] Users don't exist in database - ignoring (dummy data mode)"
      );
      return NextResponse.json(
        {
          success: true,
          message: "Ignored - users don't exist in database (dummy data mode)",
          isDummyData: true,
        },
        { status: 200 }
      );
    }

    // Check if already liked
    console.log("🔍 [LIKE API] Checking if user already liked");
    const existingLike = await prisma.userLike.findUnique({
      where: {
        userId_likedId: {
          userId,
          likedId,
        },
      },
    });

    if (existingLike) {
      console.log("⚠️ [LIKE API] User already liked this person");
      return NextResponse.json(
        { message: "Already liked this user" },
        { status: 200 }
      );
    }

    // Create the like
    console.log("💚 [LIKE API] Creating new like");
    const like = await prisma.userLike.create({
      data: {
        userId,
        likedId,
      },
      include: {
        likedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    console.log("✅ [LIKE API] Like created successfully:", like.id);

    // Check if this creates a match (mutual like)
    console.log("🔍 [LIKE API] Checking for mutual like (potential match)");
    const mutualLike = await prisma.userLike.findUnique({
      where: {
        userId_likedId: {
          userId: likedId,
          likedId: userId,
        },
      },
    });

    let match = null;
    if (mutualLike) {
      console.log("🎉 [LIKE API] MUTUAL LIKE FOUND! Creating match...");
      // Create a match
      const [userId1, userId2] = [userId, likedId].sort();
      match = await prisma.match.upsert({
        where: {
          userId1_userId2: {
            userId1,
            userId2,
          },
        },
        update: {},
        create: {
          userId1,
          userId2,
        },
      });
      console.log("🎊 [LIKE API] MATCH CREATED:", match.id);
    } else {
      console.log("💔 [LIKE API] No mutual like - no match created");
    }

    const response = {
      success: true,
      like,
      isMatch: !!match,
      match,
    };
    console.log("📤 [LIKE API] Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [LIKE API] Error creating like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, likedId } = await request.json();

    if (!userId || !likedId) {
      return NextResponse.json(
        { error: "Missing required fields: userId and likedId" },
        { status: 400 }
      );
    }

    // Remove the like
    await prisma.userLike.deleteMany({
      where: {
        userId,
        likedId,
      },
    });

    // Check if this removes a match
    const mutualLike = await prisma.userLike.findUnique({
      where: {
        userId_likedId: {
          userId: likedId,
          likedId: userId,
        },
      },
    });

    if (mutualLike) {
      // Remove the match
      const [userId1, userId2] = [userId, likedId].sort();
      await prisma.match.deleteMany({
        where: {
          userId1_userId2: {
            userId1,
            userId2,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Like removed successfully",
    });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
