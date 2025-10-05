import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("🔥 [PASS API] POST request received");

  try {
    const { userId, passedId } = await request.json();
    console.log("📝 [PASS API] Request data:", { userId, passedId });

    if (!userId || !passedId) {
      console.log("❌ [PASS API] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: userId and passedId" },
        { status: 400 }
      );
    }

    if (userId === passedId) {
      console.log("❌ [PASS API] User trying to pass on themselves");
      return NextResponse.json(
        { error: "Cannot pass on yourself" },
        { status: 400 }
      );
    }

    // Check if both users exist in database
    console.log("🔍 [PASS API] Checking if users exist");
    const [currentUser, passedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: passedId } }),
    ]);

    if (!currentUser || !passedUser) {
      console.log(
        "⚠️ [PASS API] Users don't exist in database - ignoring (dummy data mode)"
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

    // Check if already passed
    console.log("🔍 [PASS API] Checking if user already passed");
    const existingPass = await prisma.userPass.findUnique({
      where: {
        userId_passedId: {
          userId,
          passedId,
        },
      },
    });

    if (existingPass) {
      console.log("⚠️ [PASS API] User already passed on this person");
      return NextResponse.json(
        { message: "Already passed on this user" },
        { status: 200 }
      );
    }

    // Create the pass
    console.log("💔 [PASS API] Creating new pass");
    const pass = await prisma.userPass.create({
      data: {
        userId,
        passedId,
      },
      include: {
        passedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    console.log("✅ [PASS API] Pass created successfully:", pass.id);

    const response = {
      success: true,
      pass,
    };
    console.log("📤 [PASS API] Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [PASS API] Error creating pass:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, passedId } = await request.json();

    if (!userId || !passedId) {
      return NextResponse.json(
        { error: "Missing required fields: userId and passedId" },
        { status: 400 }
      );
    }

    // Remove the pass
    await prisma.userPass.deleteMany({
      where: {
        userId,
        passedId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pass removed successfully",
    });
  } catch (error) {
    console.error("Error removing pass:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
