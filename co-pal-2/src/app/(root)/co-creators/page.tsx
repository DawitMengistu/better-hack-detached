"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function CoCreatorsPage() {

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>
                        Your ongoing collaborations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No active projects</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Start collaborating with other developers
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
