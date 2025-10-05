import type { Metadata } from "next";
import Navigator from "./navigator";

export const metadata: Metadata = {
  title: "Onboarding - Co-Pal",
  description: "Complete your profile to get started with Co-Pal",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 


  return (
    <Navigator>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </Navigator>
  );
}
