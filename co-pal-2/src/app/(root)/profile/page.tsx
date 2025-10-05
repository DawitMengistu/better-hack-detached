"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { WakaTimeConnect } from "@/components/wakatime/wakatime-connect";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LinkedInConnect } from "@/components/linkedin/linkedin-connect";

export default function ProfilePage() {
    return (
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
            <LinkedInConnect />
        </div>
    );
}
