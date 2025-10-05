"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconMessage, IconEye, IconX } from "@tabler/icons-react";

interface Match {
    id: string;
    name: string;
    avatar: string;
    occupation: string;
    techStack: string[];
    matchedAt: string;
    isMatched: boolean;
}

// Hardcoded matches data
const matchedUsers: Match[] = [
    {
        id: "1",
        name: "Betelhem Dessie",
        avatar: "https://media.licdn.com/dms/image/v2/D4E22AQFdV5OlAEJanQ/feedshare-shrink_800/feedshare-shrink_800/0/1682073741589?e=2147483647&v=beta&t=NjvSCUK7wtiAdc-CZyvUZ37HUsIfLi_X3pxOnh7yogM",
        occupation: "Web & Mobile Developer",
        techStack: ["React", "React Native", "Node.js"],
        matchedAt: "2 days ago",
        isMatched: true
    },
    {
        id: "3",
        name: "Henok Tsegaye",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Henok_Tsegaye.jpg/256px-Henok_Tsegaye.jpg",
        occupation: "Full-stack Developer",
        techStack: ["JavaScript", "React", "Node.js"],
        matchedAt: "1 week ago",
        isMatched: true
    },
    {
        id: "6",
        name: "KinfeMichael Tariku",
        avatar: "https://images.crunchbase.com/image/upload/c_thumb,h_680,w_680,f_auto,g_face,z_0.7,b_white,q_auto:eco,dpr_1/5076dac89a5f495684084a4c0303e5cf",
        occupation: "Founding Engineer",
        techStack: ["React", "Node.js", "Authentication"],
        matchedAt: "3 days ago",
        isMatched: true
    }
];

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

export default function MatchesPage() {
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
                                    <p className="text-xs text-muted-foreground">{user.matchedAt}</p>
                                </div>

                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                    <IconMessage className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
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
