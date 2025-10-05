"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

export function LinkedInConnect({ linked, loading }: { linked: boolean; loading?: boolean }) {
    const [isLinking, setIsLinking] = useState(false);

    const handleConnect = async () => {
        setIsLinking(true);
        try {
            await authClient.linkSocial({
                provider: "linkedin",
                callbackURL: "/profile"
            });
        } catch (error) {
            toast.error("Failed to link LinkedIn account. Please try again.");
            setIsLinking(false);
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
                    Link your LinkedIn account to your profile to share your professional achievements, network with other developers, and showcase your projects.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleConnect}
                    disabled={isLinking || linked || loading}
                    className={`w-full ${linked ? 'bg-green-600 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {loading ? (
                                        <span className="text-xs">Checking...</span>
                                    ) : linked ? (
                                        <span className="text-xs">Linked</span>
                                    ) : isLinking ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Linking...
                                        </>
                                    ) : (
                                        <>
                                            <IconBrandLinkedin className="w-4 h-4 mr-2" />
                                            Link LinkedIn Account
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                }
