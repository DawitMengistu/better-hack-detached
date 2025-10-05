
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
        <div className="min-h-screen bg-background">
        <main className="pb-20">
            {/* {children} */}
            <div className="min-h-screen bg-background pb-16">
                <div className="max-w-sm mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">You</h1>
                            <p className="text-muted-foreground mt-1">
                                Your profile and settings
                            </p>
                        </div>
                        <SignOutButton />
                    </div>

                    {/* Profile Content */}
                    {children}
                </div>
            </div>
        </main>
        </div>
    </ProtectedRoute>
  );
}











