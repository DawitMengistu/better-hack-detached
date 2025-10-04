"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserCard, UserProfile } from "@/components/feed/user-card";
import { ProfileModal } from "@/components/feed/profile-modal";
import { toast } from "sonner";

// Sample user data for testing
const sampleUsers: UserProfile[] = [
  {
    id: "1",
    name: "Alex Chen",
    username: "alexchen",
    bio: "Full-stack developer passionate about React and Node.js. Love building scalable applications and contributing to open source projects.",
    avatar: "",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    languages: ["JavaScript", "Python", "Go"],
    totalHours: 1247,
    averageHours: 6.2,
    lastActive: "2 hours ago",
    joinedDate: "Jan 2023"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    username: "sarahj",
    bio: "Frontend specialist with expertise in modern JavaScript frameworks. Currently exploring AI/ML integration in web applications.",
    avatar: "",
    location: "New York, NY",
    skills: ["Vue.js", "React", "SASS", "Webpack", "Jest"],
    languages: ["JavaScript", "TypeScript", "Python"],
    totalHours: 892,
    averageHours: 4.8,
    lastActive: "1 day ago",
    joinedDate: "Mar 2023"
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    username: "marcusr",
    bio: "Backend engineer focused on microservices and cloud architecture. Enjoy mentoring junior developers and sharing knowledge.",
    avatar: "",
    location: "Austin, TX",
    skills: ["Docker", "Kubernetes", "GraphQL", "Redis", "MongoDB"],
    languages: ["Go", "Python", "Java", "Bash"],
    totalHours: 1563,
    averageHours: 7.1,
    lastActive: "30 min ago",
    joinedDate: "Nov 2022"
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

      {/* Profile Modal */}
      <ProfileModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </ProtectedRoute>
  );
}
