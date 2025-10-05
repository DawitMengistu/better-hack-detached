"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MatchesPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Matches</CardTitle>
                    <CardDescription>
                        Find developers with complementary skills
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No matches yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Complete your profile to find potential collaborators
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
