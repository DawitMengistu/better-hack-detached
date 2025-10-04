"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconX, IconCode, IconStar, IconMapPin, IconCalendar, IconTrendingUp } from "@tabler/icons-react";
import { UserProfile } from "./user-card";

interface ProfileModalProps {
    user: UserProfile | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ user, isOpen, onClose }: ProfileModalProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    if (!isOpen || !user) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-x-0 bottom-0 top-0 z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-t-2xl w-full max-w-sm mx-auto max-h-[90vh] overflow-hidden shadow-2xl">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <IconX className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
                        {/* Profile Header */}
                        <Card className="m-4 mb-0">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <Avatar className="h-20 w-20 mb-4">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-xl font-semibold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
                                    <p className="text-muted-foreground mb-2">@{user.username}</p>

                                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                                        <IconMapPin className="w-4 h-4 mr-1" />
                                        {user.location}
                                    </div>

                                    <p className="text-sm text-muted-foreground text-center mb-6">
                                        {user.bio}
                                    </p>

                                    <div className="flex gap-2 w-full">
                                        <Button className="flex-1">Connect</Button>
                                        <Button variant="outline" className="flex-1">Message</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card className="m-4 mb-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-base">
                                    <IconTrendingUp className="w-4 h-4 mr-2" />
                                    Activity Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-foreground">{user.totalHours}</p>
                                        <p className="text-xs text-muted-foreground">Total Hours</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-foreground">{user.averageHours}</p>
                                        <p className="text-xs text-muted-foreground">Avg/Day</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-foreground">{user.joinedDate}</p>
                                        <p className="text-xs text-muted-foreground">Joined</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card className="m-4 mb-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-base">
                                    <IconCode className="w-4 h-4 mr-2" />
                                    Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Languages */}
                        <Card className="m-4 mb-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-base">
                                    <IconStar className="w-4 h-4 mr-2" />
                                    Languages
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {user.languages.map((lang, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card className="m-4 mb-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-base">
                                    <IconCalendar className="w-4 h-4 mr-2" />
                                    Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Last Active</span>
                                        <span className="text-sm text-foreground">{user.lastActive}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Member Since</span>
                                        <span className="text-sm text-foreground">{user.joinedDate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

