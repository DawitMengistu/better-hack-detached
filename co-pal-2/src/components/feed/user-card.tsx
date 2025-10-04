"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCode, IconStar, IconMapPin, IconClock } from "@tabler/icons-react";

export interface UserProfile {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatar?: string;
    location: string;
    skills: string[];
    languages: string[];
    totalHours: number;
    averageHours: number;
    lastActive: string;
    joinedDate: string;
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
            className="w-full h-full cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onClick(user)}
        >
            <CardContent className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-lg font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        <IconClock className="w-3 h-3 mr-1" />
                        {user.lastActive}
                    </Badge>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {user.bio}
                </p>

                {/* Location */}
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <IconMapPin className="w-4 h-4 mr-1" />
                    {user.location}
                </div>

                {/* Skills */}
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <IconCode className="w-4 h-4 mr-1 text-primary" />
                        <span className="text-sm font-medium text-foreground">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {user.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                            </Badge>
                        ))}
                        {user.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{user.skills.length - 3} more
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <IconStar className="w-4 h-4 mr-1 text-primary" />
                        <span className="text-sm font-medium text-foreground">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {user.languages.slice(0, 3).map((lang, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {lang}
                            </Badge>
                        ))}
                        {user.languages.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{user.languages.length - 3} more
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{user.totalHours}h</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{user.averageHours}h</p>
                        <p className="text-xs text-muted-foreground">Avg/Day</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{user.joinedDate}</p>
                        <p className="text-xs text-muted-foreground">Joined</p>
                    </div>
                </div>

                {/* Action Button */}
                <Button className="w-full mt-4" variant="outline">
                    View Profile
                </Button>
            </CardContent>
        </Card>
    );
}

