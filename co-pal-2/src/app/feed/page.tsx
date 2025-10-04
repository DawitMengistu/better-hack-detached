"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserCard, UserProfile } from "@/components/feed/user-card";
import { ProfileSlide } from "@/components/feed/profile-slide";
import { toast } from "sonner";

// Sample user data for testing
const sampleUsers: UserProfile[] = [
  {
    id: "1",
    name: "Alex Chen",
    bio: "Full-stack developer passionate about React and Node.js Full-stack developer passionate about React and Node.js",
    avatar: ""
  },
  {
    id: "2",
    name: "Sarah Johnson",
    bio: "Frontend specialist with expertise in modern JavaScript frameworks",
    avatar: ""
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    bio: "Backend engineer focused on microservices and cloud architecture",
    avatar: ""
  },
  {
    id: "4",
    name: "Emily Davis",
    bio: "UI/UX designer creating beautiful and intuitive user experiences",
    avatar: ""
  },
  {
    id: "5",
    name: "David Kim",
    bio: "DevOps engineer passionate about automation and infrastructure",
    avatar: ""
  }
];

export default function FeedPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  };

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-16">
        <div className="max-w-sm mx-auto py-8 px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Feed</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back!
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          {/* Feed Content */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {sampleUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={handleUserClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Slide */}
      <ProfileSlide
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </ProtectedRoute>
  );
}
