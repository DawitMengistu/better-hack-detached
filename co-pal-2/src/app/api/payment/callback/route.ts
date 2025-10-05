import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Payment callback received:", body);

    // Verify the payment status
    if (body.status === "success" && body.tx_ref) {
      const txRef = body.tx_ref;

      // Extract metadata from the transaction reference or body
      const userId = body.meta?.user_id;
      const connectAmount = parseInt(body.meta?.connect_amount || "0");
      const bonusAmount = parseInt(body.meta?.bonus_amount || "0");
      const totalConnects = connectAmount + bonusAmount;

      if (!userId || !connectAmount) {
        console.error("Missing required payment data:", {
          userId,
          connectAmount,
        });
        return NextResponse.json(
          { error: "Missing payment data" },
          { status: 400 }
        );
      }

      // Add connects to user's balance
      await prisma.user.update({
        where: { id: userId },
        data: {
          connectBalance: {
            increment: totalConnects,
          },
        },
      });

      console.log(`Added ${totalConnects} connects to user ${userId}`);

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        connectsAdded: totalConnects,
      });
    } else {
      console.error("Payment failed:", body);
      return NextResponse.json({ error: "Payment failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get("tx_ref");
    const status = searchParams.get("status");

    console.log("Payment return callback:", { txRef, status });

    if (status === "success") {
      // Redirect to profile with success message
      return NextResponse.redirect(
        new URL("/profile?payment=success", request.url)
      );
    } else {
      // Redirect to profile with error message
      return NextResponse.redirect(
        new URL("/profile?payment=error", request.url)
      );
    }
  } catch (error) {
    console.error("Payment return callback error:", error);
    return NextResponse.redirect(
      new URL("/profile?payment=error", request.url)
    );
  }
}
