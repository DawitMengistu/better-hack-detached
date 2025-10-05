"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconMessage, IconEye, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { authClient } from '@/lib/auth-client';

interface ApiMatch {
    id: string;
    createdAt: string;
    otherUser: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

interface Match {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
    techStack: string[];
    matchedAt: string;
    isMatched: boolean;
}

// Hardcoded pending matches (users who liked you but you haven't seen yet)
const pendingMatches: Match[] = [
    {
        id: "2",
        name: "Timnit Gebru",
        avatar: "https://radcliffe-harvard-edu.imgix.net/a7bba5e2-7668-44eb-be5d-03bed343dc0b/Timnit-Gebru_COURTESY.jpg",
        occupation: "AI Researcher / Ethicist",
        techStack: ["Python", "TensorFlow", "Machine Learning"],
        matchedAt: "Just now",
        isMatched: false
    },
    {
        id: "4",
        name: "Lewam Kefela",
        avatar: "https://partechpartners.com/_next/image?url=https%3A%2F%2Fpartech-admin.prod.unomena.io%2Fmedia%2Fimages%2FLewam_Kafela.format-webp.webp&w=3840&q=75",
        occupation: "Venture / Design & Investment",
        techStack: ["Design Thinking", "Figma", "Analytics"],
        matchedAt: "5 minutes ago",
        isMatched: false
    },
    {
        id: "7",
        name: "Dagmawi Esayas",
        avatar: "https://i.imgur.com/6YkKydE.png",
        occupation: "Software Engineer / Entrepreneur",
        techStack: ["Python", "JavaScript", "Docker"],
        matchedAt: "1 hour ago",
        isMatched: false
    }
];

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} weeks ago`;
};

export default function MatchesPage() {
    const [matchedUsers, setMatchedUsers] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Get session from auth client to identify the logged in user
    const { data: session, isPending } = authClient.useSession();

    // Fetch real matches from backend
    useEffect(() => {
        const fetchCurrentUserAndMatches = async () => {
            try {
                // Prefer session user id as the source of truth
                let userIdToUse: string | null = null;
                if (session && session.user && session.user.id) {
                    console.log(`👤 [MATCHES] Session user id found: ${session.user.id}`);
                    setCurrentUserId(session.user.id);
                    userIdToUse = session.user.id;
                } else {
                    // Fallback: fetch test-data users only if session is not available
                    console.log('⚠️ [MATCHES] No session user id available; falling back to test-data users');
                    const usersResponse = await fetch('/api/test-data/users');
                    const usersData = await usersResponse.json();

                    if (usersData.success && usersData.users && usersData.users.length > 0) {
                        const fetchedCurrentUserId = usersData.users[0]?.id;
                        if (fetchedCurrentUserId) {
                            setCurrentUserId(fetchedCurrentUserId);
                            userIdToUse = fetchedCurrentUserId;
                            console.log(`👤 [MATCHES] Using fallback current user: ${fetchedCurrentUserId}`);
                        }
                    }
                }
                if (!userIdToUse) {
                    console.warn('⚠️ [MATCHES] No user id available to fetch matches');
                    setMatchedUsers([]);
                    return;
                }

                // Then fetch matches with current user ID
                const response = await fetch(`/api/user-interactions/matches?userId=${userIdToUse}`);
                const data = await response.json();

                if (data.success && data.matches) {
                    // Transform API matches to our Match interface
                    const transformedMatches: Match[] = data.matches.map((match: ApiMatch) => ({
                        id: match.otherUser.id,
                        name: match.otherUser.name,
                        avatar: match.otherUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.otherUser.name)}&background=random`,
                        occupation: "Developer", // You can fetch this from user profile if needed
                        techStack: ["React", "Node.js"], // You can fetch this from user profile if needed
                        matchedAt: formatTimeAgo(match.createdAt),
                        isMatched: true
                    }));

                    setMatchedUsers(transformedMatches);
                }
            } catch (error) {
                console.error('Failed to fetch matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUserAndMatches();
    }, []);

    return (
        <div className="space-y-6 p-2 overflow-y-auto mb-10 scrollbar-hide">
            {/* Your Matches Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Your Matches ({matchedUsers.length})
                    </CardTitle>
                    <CardDescription className="text-xs">
                        People you've successfully connected with
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground">Loading matches...</p>
                        </div>
                    ) : matchedUsers.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-muted-foreground">No matches yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Start swiping to find your perfect match!</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {matchedUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-xs font-medium">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-foreground truncate">{user.name}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{user.occupation}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Matched</p>
                                        <p className="text-sm font-medium text-foreground">{user.matchedAt}</p>
                                    </div>

                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                        <IconMessage className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pending Matches Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        They Liked You ({pendingMatches.length})
                    </CardTitle>
                    <CardDescription className="text-xs">
                        People who want to connect with you
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-1">
                        {pendingMatches.map((user) => (
                            <div key={user.id} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-xs font-medium">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-foreground truncate">{user.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{user.occupation}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{user.matchedAt}</p>
                                </div>

                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                    <IconEye className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
