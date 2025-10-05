"use client";

import { useState } from "react";
import { UserCard, UserProfile } from "@/components/feed/user-card";
import { ProfileSlide } from "@/components/feed/profile-slide";
import { GitHubStatsDisplay } from "@/components/github/github-stats-display";

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
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
      <>
      <GitHubStatsDisplay />
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

      {/* Profile Slide */}
      <ProfileSlide
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
