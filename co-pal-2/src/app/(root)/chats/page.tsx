"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function ChatsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Conversations</CardTitle>
                    <CardDescription>
                        Connect with your collaborators
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No conversations yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Start a conversation with your matches
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
