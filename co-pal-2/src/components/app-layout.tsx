"use client";

import { usePathname } from "next/navigation";
import { BottomNavigation } from "@/components/bottom-navigation";

interface AppLayoutProps {
    children: React.ReactNode;
}

const protectedRoutes = ["/feed", "/matches", "/chats", "/co-creators", "/profile"];

export function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();
    const showNavigation = protectedRoutes.includes(pathname);

    return (
        <>
            {children}
            {showNavigation && <BottomNavigation />}
        </>
    );
}
