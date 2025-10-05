"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { PaymentPackage } from "@/lib/payment-types";

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function initiatePayment(packageInfo: PaymentPackage) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    console.log("Session data:", session);

    if (!session?.user) {
      console.error("No user found in session");
      throw new Error("User not authenticated");
    }

    if (!CHAPA_SECRET_KEY) {
      throw new Error("Chapa secret key not configured");
    }

    const txRef = `connect-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Price is already in ETB
    const amountInETB = packageInfo.price;

    const paymentData = {
      amount: amountInETB.toString(),
      currency: "ETB",
      email: session.user.email || "user@example.com",
      first_name: session.user.name?.split(" ")[0] || "User",
      last_name: session.user.name?.split(" ").slice(1).join(" ") || "",
      phone_number: "0912345678", // Default phone number
      tx_ref: txRef,
      callback_url: `${APP_URL}/api/payment/callback`,
      return_url: `${APP_URL}/profile?payment=success`,
      "customization[title]": "Co-Pal Connect Purchase",
      "customization[description]": `Purchase ${packageInfo.amount} connects${
        packageInfo.bonus > 0 ? ` with ${packageInfo.bonus} bonus` : ""
      }`,
      "meta[hide_receipt]": "true",
      "meta[user_id]": session.user.id,
      "meta[connect_amount]": packageInfo.amount.toString(),
      "meta[bonus_amount]": packageInfo.bonus.toString(),
    };

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chapa API Error:", errorText);
      throw new Error(`Payment initialization failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success" && result.data?.checkout_url) {
      return {
        success: true,
        checkoutUrl: result.data.checkout_url,
        txRef: txRef,
      };
    } else {
      throw new Error("Invalid response from payment provider");
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw new Error("Failed to initiate payment. Please try again.");
  }
}
