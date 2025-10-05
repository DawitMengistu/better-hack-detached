"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function WakaTimeConnect({ linked, loading }: { linked: boolean; loading?: boolean }) {
    const [isLinking, setIsLinking] = useState(false);

    const handleConnect = async () => {
        setIsLinking(true);
        try {
            await authClient.linkSocial({
                provider: "wakatime",
                callbackURL: "/profile"
            });
        } catch (error) {
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
                    disabled={isLinking || linked || loading}
                    className={`w-full ${linked ? 'bg-green-600 text-white cursor-default' : ''}`}
                    variant={linked ? "default" : "outline"}
                >
                    {loading ? (
                        <span className="text-xs">Checking...</span>
                    ) : linked ? (
                        <span className="text-xs">Linked</span>
                    ) : isLinking ? (
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
