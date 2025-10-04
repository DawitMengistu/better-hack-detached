"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface UserProfile {
    id: string;
    name: string;
    bio: string;
    avatar?: string;
}

interface UserCardProps {
    user: UserProfile;
    onClick: (user: UserProfile) => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card
            className="w-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onClick(user)}
        >
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-sm font-semibold">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

