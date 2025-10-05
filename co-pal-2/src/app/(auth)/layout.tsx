import type { Metadata } from "next";
import { GuestRoute } from "@/components/auth/guest-route";

export const metadata: Metadata = {
  title: "Authentication - Co-Pal",
  description: "Sign in or sign up to access Co-Pal",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </GuestRoute>
  );
}
