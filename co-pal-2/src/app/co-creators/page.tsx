"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CoCreatorsPage() {
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
                            <h1 className="text-3xl font-bold text-foreground">Co-Creators</h1>
                            <p className="text-muted-foreground mt-1">
                                Active collaborations
                            </p>
                        </div>
                        <Button onClick={handleSignOut} variant="outline">
                            Sign Out
                        </Button>
                    </div>

                    {/* Co-Creators Content */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Projects</CardTitle>
                                <CardDescription>
                                    Your ongoing collaborations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No active projects</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Start collaborating with other developers
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
