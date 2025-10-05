"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { isProfileComplete, arePreferencesSet } from "./actions";

export default function Navigator({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (!session?.user?.id) {
                setIsCheckingProfile(false);
                return;
            }

            try {
                const profileComplete = await isProfileComplete(session.user.id);
                
                if (profileComplete) {
                    // Onboarding is complete, check preferences
                    const preferencesSet = await arePreferencesSet(session.user.id);
                    
                    if (!preferencesSet) {
                        // Onboarding complete but preferences not set, redirect to preferences
                        router.push("/preferences");
                        return;
                    } else {
                        // Both onboarding and preferences are complete, redirect to main app
                        router.push("/feed");
                        return;
                    }
                } else {
                    console.log("🌄👉: profileComplete", profileComplete, "Onboarding not complete")
                }
            } catch (error) {
                console.error("Error checking profile completion:", error);
            } finally {
                setIsCheckingProfile(false);
            }
        };

        if (!isPending) {
            checkProfileCompletion();
        }
    }, [session, isPending, router]);

    // Show loading while checking profile completion
    if (isCheckingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Checking profile...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}
