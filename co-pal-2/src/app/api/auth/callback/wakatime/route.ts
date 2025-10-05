import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("WakaTime OAuth error:", error);
    return NextResponse.redirect(
      new URL("/feed?error=wakatime_auth_failed", request.url)
    );
  }

  if (!code) {
    console.error("No authorization code received from WakaTime");
    return NextResponse.redirect(new URL("/feed?error=no_code", request.url));
  }

  try {
    // Exchange authorization code for access token
    const tokenParams = {
      client_id: process.env.WAKATIME_CLIENT_ID!,
      client_secret: process.env.WAKATIME_CLIENT_SECRET!,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: `${
        process.env.BETTER_AUTH_URL || "http://localhost:3000"
      }/api/auth/callback/wakatime`,
    };

    console.log("Token exchange params:", {
      ...tokenParams,
      client_secret: "***",
    });

    // Debug: Check if environment variables are loaded correctly
    console.log("Environment check:");
    console.log("WAKATIME_CLIENT_ID:", process.env.WAKATIME_CLIENT_ID);
    console.log("WAKATIME_CLIENT_SECRET:", process.env.WAKATIME_CLIENT_SECRET);
    console.log("Expected App ID from dashboard: r4UsokDtagvDTZwoIeVQhHXY");
    console.log("Expected App Secret from dashboard: [REDACTED]");

    // Try the exact format WakaTime expects
    const formData = new URLSearchParams();
    formData.append("client_id", tokenParams.client_id);
    formData.append("client_secret", tokenParams.client_secret);
    formData.append("code", tokenParams.code);
    formData.append("grant_type", tokenParams.grant_type);
    formData.append("redirect_uri", tokenParams.redirect_uri);

    console.log("Form data:", formData.toString());

    const tokenResponse = await fetch("https://wakatime.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData,
    });

    console.log("Token response status:", tokenResponse.status);
    console.log(
      "Token response headers:",
      Object.fromEntries(tokenResponse.headers.entries())
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange error response:", errorText);
      console.error(
        "Response content type:",
        tokenResponse.headers.get("content-type")
      );

      // Try to parse as JSON first, then fall back to text
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage =
          errorJson.error_description || errorJson.error || errorText;
      } catch {
        // Not JSON, use text as is
      }

      throw new Error(
        `Token exchange failed: ${tokenResponse.statusText} - ${errorMessage}`
      );
    }

    const tokenData = await tokenResponse.json();

    // Log what WakaTime gives us
    console.log("=== WAKATIME TOKEN RESPONSE ===");
    console.log("Full token data:", JSON.stringify(tokenData, null, 2));
    console.log("Access token:", tokenData.access_token);
    console.log("Refresh token:", tokenData.refresh_token);
    console.log("Token type:", tokenData.token_type);
    console.log("Expires in:", tokenData.expires_in);
    console.log("=================================");

    // Get current user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      // Save WakaTime tokens to database
      try {
        await prisma.wakaTime.upsert({
          where: { userId: session.user.id },
          update: {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || null,
            tokenType: tokenData.token_type || null,
            expiresIn: tokenData.expires_in || null,
            scope: tokenData.scope || null,
          },
          create: {
            userId: session.user.id,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || null,
            tokenType: tokenData.token_type || null,
            expiresIn: tokenData.expires_in || null,
            scope: tokenData.scope || null,
          },
        });
        console.log(
          "✅ WakaTime tokens saved to database for user:",
          session.user.id
        );
      } catch (dbError) {
        console.error("❌ Failed to save WakaTime tokens:", dbError);
      }
    } else {
      console.log("⚠️ No user session found, skipping database save");
    }

    // Redirect to profile page where WakaTime component is located
    return NextResponse.redirect(
      new URL("/profile?wakatime=connected", request.url)
    );
  } catch (error) {
    console.error("WakaTime OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/feed?error=wakatime_callback_failed", request.url)
    );
  }
}
