"use client";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
