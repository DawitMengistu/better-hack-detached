"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChatsPage() {
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
                            <h1 className="text-3xl font-bold text-foreground">Chats</h1>
                            <p className="text-muted-foreground mt-1">
                                Your conversations
                            </p>
                        </div>
                        <Button onClick={handleSignOut} variant="outline">
                            Sign Out
                        </Button>
                    </div>

                    {/* Chats Content */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Conversations</CardTitle>
                                <CardDescription>
                                    Connect with your collaborators
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No conversations yet</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Start a conversation with your matches
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
