"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface UserProfile {
    id: string;
    name: string;
    bio: string;
    avatar?: string;
    occupation?: string;
    techStack?: string[];
    age?: number;
    country?: string;
    image?: string; // For the main profile image
}

interface UserCardProps {
    user: UserProfile;
    onClick: (user: UserProfile) => void;
    borderClass?: string;
}

export function UserCard({ user, onClick, borderClass }: UserCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card
            className={`w-full h-[calc(80vh-60px)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden border-0 ${borderClass || ''}`}
        >
            <div className="h-full flex flex-col">
                {/* Top Image Section - 50% of card height */}
                <div className="relative h-1/2 bg-gradient-to-br from-blue-400 to-purple-500">
                    {/* Profile Image */}
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <Avatar className="h-20 w-20 border-4 border-white/20">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-2xl font-semibold bg-white/20 text-white">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}

                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
                        {user.occupation && (
                            <p className="text-lg text-white/90 font-medium">{user.occupation}</p>
                        )}
                    </div>
                </div>

                {/* Bottom Content Section - 50% of card height */}
                <div className="h-1/2 p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                        {/* Bio */}
                        <p className="text-sm text-muted-foreground line-clamp-3">{user.bio}</p>

                        {/* Tech Stack */}
                        {user.techStack && user.techStack.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground">Tech Stack</h4>
                                <div className="flex flex-wrap gap-1">
                                    {user.techStack.slice(0, 4).map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {user.techStack.length > 4 && (
                                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                            +{user.techStack.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Info */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        {user.age && <span>{user.age} years old</span>}
                        {user.country && <span>{user.country}</span>}
                    </div>

                    {/* View Profile Button */}
                    <div className="mt-4">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(user);
                            }}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="sm"
                        >
                            View Profile
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

