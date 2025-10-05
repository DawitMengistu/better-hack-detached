"use client";

import { useState } from "react";
import { UserProfile } from "@/components/feed/user-card";
import { SwipeableCardStack } from "@/components/feed/SwipeableCardStack";

// Sample user data for testing
const sampleUsers: UserProfile[] = [
  {
    id: "1",
    name: "Alex Chen",
    bio: "Full-stack developer passionate about React and Node.js. Love building scalable applications and exploring new technologies.",
    avatar: "",
    occupation: "Full-Stack Developer",
    techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    age: 28,
    country: "United States"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    bio: "Frontend specialist with expertise in modern JavaScript frameworks. Creating beautiful user experiences with React and Vue.",
    avatar: "",
    occupation: "Frontend Developer",
    techStack: ["React", "Vue.js", "JavaScript", "CSS3", "Figma"],
    age: 26,
    country: "Canada"
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    bio: "Backend engineer focused on microservices and cloud architecture. Passionate about system design and performance optimization.",
    avatar: "",
    occupation: "Backend Engineer",
    techStack: ["Python", "Go", "Docker", "Kubernetes", "MongoDB"],
    age: 32,
    country: "Spain"
  },
  {
    id: "4",
    name: "Emily Davis",
    bio: "UI/UX designer creating beautiful and intuitive user experiences. Specializing in mobile app design and user research.",
    avatar: "",
    occupation: "UI/UX Designer",
    techStack: ["Figma", "Sketch", "Adobe XD", "Principle", "InVision"],
    age: 29,
    country: "United Kingdom"
  },
  {
    id: "5",
    name: "David Kim",
    bio: "DevOps engineer passionate about automation and infrastructure. Building reliable CI/CD pipelines and cloud solutions.",
    avatar: "",
    occupation: "DevOps Engineer",
    techStack: ["AWS", "Terraform", "Jenkins", "Docker", "Linux"],
    age: 30,
    country: "South Korea"
  },
  {
    id: "6",
    name: "Lisa Wang",
    bio: "Data scientist with expertise in machine learning and analytics. Turning data into actionable insights for businesses.",
    avatar: "",
    occupation: "Data Scientist",
    techStack: ["Python", "TensorFlow", "Pandas", "SQL", "Jupyter"],
    age: 27,
    country: "China"
  },
  {
    id: "7",
    name: "James Thompson",
    bio: "Mobile developer creating cross-platform apps with React Native and Flutter. Love building apps that make a difference.",
    avatar: "",
    occupation: "Mobile Developer",
    techStack: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    age: 31,
    country: "Australia"
  },
  {
    id: "8",
    name: "Maria Garcia",
    bio: "Product manager with a technical background. Bridging the gap between engineering and business to deliver great products.",
    avatar: "",
    occupation: "Product Manager",
    techStack: ["Agile", "Scrum", "Jira", "Analytics", "SQL"],
    age: 33,
    country: "Mexico"
  }
];

export default function FeedPage() {
  const handleSwipeLeft = (user: UserProfile) => {
    console.log("Passed on:", user.name);
    // Here you can add logic to track passes, update preferences, etc.
  };

  const handleSwipeRight = (user: UserProfile) => {
    console.log("Liked:", user.name);
    // Here you can add logic to track likes, check for matches, etc.
  };

  const handleAllCardsSwiped = () => {
    console.log("All cards have been swiped!");
    // Here you can show a message or load more users
  };

  const handleCardClick = (user: UserProfile) => {
    console.log("Card clicked:", user.name);
    // The modal functionality is now handled within SwipeableCardStack
  };

  return (
    <div className="h-full bg-background overflow-hidden">
      <SwipeableCardStack
        users={sampleUsers}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onAllCardsSwiped={handleAllCardsSwiped}
        onCardClick={handleCardClick}
        maxVisibleCards={1}
        className="h-full"
      />
    </div>
  );
}
