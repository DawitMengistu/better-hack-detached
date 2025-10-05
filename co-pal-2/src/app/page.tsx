"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-sm mx-auto">
      <div className="flex flex-col items-center justify-center max-w-sm w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Find Your Co-Pals
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Find your co-pals and start collaborating today
          </p>
        </div>
        <Button onClick={() => router.push("/signup")}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
