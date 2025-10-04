"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    IconGpsFilled,
    IconPlugConnected,
    IconMessage,
    IconUsers,
    IconUser
} from "@tabler/icons-react";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
    {
        name: "Explore",
        href: "/feed",
        icon: IconGpsFilled,
    },
    {
        name: "Matches",
        href: "/matches",
        icon: IconPlugConnected,
    },
    {
        name: "Chats",
        href: "/chats",
        icon: IconMessage,
    },
    {
        name: "Co-Creators",
        href: "/co-creators",
        icon: IconUsers,
    },
    {
        name: "You",
        href: "/profile",
        icon: IconUser,
    },
];

export function BottomNavigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border max-w-sm mx-auto">
            <div className="flex items-center justify-around px-2 py-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground"
                            )}
                        >
                            <IconComponent className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
