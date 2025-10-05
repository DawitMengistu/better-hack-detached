
import { ProtectedRoute } from "@/components/auth/protected-route";
import SignOutButton from "@/components/auth/SignOutButton";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Co-Pal",
  description: "Connect with like-minded creators and collaborators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ProtectedRoute>
      <div className=" bg-red-500">

        {/* {children} */}
        <div className="min-h-full bg-background">
          <div className="max-w-sm mx-auto py-8 px-4 h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-3xl font-bold text-foreground">co-pal</h1>
                <p className="text-muted-foreground mt-1">
                  find your next co-creator
                </p>
              </div>
              <SignOutButton />
            </div>

            {/* Profile Content */}
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}











