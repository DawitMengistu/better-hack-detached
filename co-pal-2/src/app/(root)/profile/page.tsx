"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { WakaTimeConnect } from "@/components/wakatime/wakatime-connect";
import { LinkedInConnect } from "@/components/linkedin/linkedin-connect";
import { GitHubStatsDisplay } from "@/components/github/github-stats-display";
import { useIntegrationStatus } from "@/hooks/use-integration-status";
import { ConnectBalance } from "@/components/profile/connect-balance";
import { initiatePayment } from "@/app/actions/payment";
import { connectPackages } from "@/lib/payment-types";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [connectBalance, setConnectBalance] = useState(150); // Dummy balance

    // Dummy userId for demo; replace with actual user context
    const userId = "current-user-id";
    const { status, loading } = useIntegrationStatus(userId);

    useEffect(() => {
        // Check for payment success/error messages
        const paymentStatus = searchParams.get("payment");
        if (paymentStatus === "success") {
            toast.success("Payment completed successfully! Your connects have been added.");
        } else if (paymentStatus === "error") {
            toast.error("Payment failed. Please try again.");
        }
    }, [searchParams]);

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

    const handleBuyConnects = async (amount: number) => {
        try {
            // Find the package info
            const packageInfo = connectPackages.find(pkg => pkg.amount === amount);
            if (!packageInfo) {
                throw new Error("Invalid package selected");
            }

            // Initiate payment
            const result = await initiatePayment(packageInfo);

            if (result.success && result.checkoutUrl) {
                // Redirect to payment page
                window.location.href = result.checkoutUrl;
            } else {
                throw new Error("Failed to initiate payment");
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-16">
            <div className="max-w-sm mx-auto py-2 px-2">
                {/* Connect Balance - Top Priority */}
                <div className="mb-6">
                    <ConnectBalance
                        balance={connectBalance}
                        onBuyConnects={handleBuyConnects}
                    />
                </div>

                {/* Integration Status */}
                <div className="space-y-4 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Integration Status</CardTitle>
                            <CardDescription>
                                See which accounts are linked to your profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-muted-foreground">Checking integrations...</div>
                            ) : (
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium">GitHub:</span>
                                        <span className={status.github ? "text-green-600" : "text-red-500"}>
                                            {status.github ? "Linked" : "Not Linked"}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium">LinkedIn:</span>
                                        <span className={status.linkedin ? "text-green-600" : "text-red-500"}>
                                            {status.linkedin ? "Linked" : "Not Linked"}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="font-medium">WakaTime:</span>
                                        <span className={status.wakatime ? "text-green-600" : "text-red-500"}>
                                            {status.wakatime ? "Linked" : "Not Linked"}
                                        </span>
                                    </li>
                                </ul>
                            )}
                        </CardContent>
                    </Card>
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

                    {/* Integration Connect Buttons */}
                    <GitHubStatsDisplay />
                    <WakaTimeConnect linked={!!status.wakatime} loading={loading} />
                    <LinkedInConnect linked={!!status.linkedin} loading={loading} />
                </div>
            </div>
        </div>
    );
}
