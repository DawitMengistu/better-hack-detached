"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

export function LinkedInConnect() {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            // Use Better Auth LinkedIn social sign-in
            await authClient.signIn.social({
                provider: "linkedin"
            });
        } catch (error) {
            console.error("LinkedIn connection error:", error);
            toast.error("Failed to connect to LinkedIn. Please try again.");
            setIsConnecting(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconBrandLinkedin className="w-5 h-5 text-blue-600" />
                    LinkedIn Integration
                </CardTitle>
                <CardDescription>
                    Connect your LinkedIn account to share your professional achievements, network with other developers, and showcase your projects.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {isConnecting ? (
                        <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <IconBrandLinkedin className="w-4 h-4 mr-2" />
                            Connect LinkedIn
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
