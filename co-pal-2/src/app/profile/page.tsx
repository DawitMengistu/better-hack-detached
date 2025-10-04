"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { WakaTimeConnect } from "@/components/wakatime/wakatime-connect";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            toast.success("Signed out successfully");
            router.push("/");
        } catch (error) {
            toast.error("Failed to sign out. Please try again.");
            console.error("Sign out error:", error);
        }
    };

    return (
        <ProtectedRoute>
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
                        <Button onClick={handleSignOut} variant="outline">
                            Sign Out
                        </Button>
                    </div>

                    {/* Profile Content */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your latest updates and notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>Hello Profile!</div>
                            </CardContent>
                        </Card>

                        <WakaTimeConnect />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
