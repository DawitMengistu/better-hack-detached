"use client";


import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function Navigator({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    console.log("💯👉👉👉: ",session)
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}
