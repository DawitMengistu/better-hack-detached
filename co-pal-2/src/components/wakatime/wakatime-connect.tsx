"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function WakaTimeConnect() {
    const [isLinking, setIsLinking] = useState(false);

    const handleConnect = async () => {
        setIsLinking(true);
        try {
            console.log("Attempting WakaTime account linking with Better Auth...");
            console.log("Base URL:", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

            // Use Better Auth account linking for WakaTime
            await authClient.linkSocial({
                provider: "wakatime",
                callbackURL: "/profile"
            });
        } catch (error) {
            console.error("WakaTime account linking error:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            toast.error("Failed to link WakaTime account. Please try again.");
            setIsLinking(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                        <path d="M12 6v6l4.5 2.7-1.5 2.5L10 13V6h2z" />
                    </svg>
                    WakaTime Integration
                </CardTitle>
                <CardDescription>
                    Link your WakaTime account to your profile to track your coding activity and get insights into your development time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleConnect}
                    disabled={isLinking}
                    className="w-full"
                    variant="outline"
                >
                    {isLinking ? (
                        <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                            Linking...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                <path d="M12 6v6l4.5 2.7-1.5 2.5L10 13V6h2z" />
                            </svg>
                            Link WakaTime Account
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
