"use client";

import { useState } from "react";
import { UserProfile } from "@/components/feed/user-card";
import { SwipeableCardStack } from "@/components/feed/SwipeableCardStack";

// Sample user data for testing
const sampleUsers: UserProfile[] = [
  {
    id: "1",
    name: "Betelhem Dessie",
    bio: "Innovative web and mobile developer from Ethiopia, passionate about creating technology solutions that bridge gaps in education and accessibility. Founder of robotics programs for young girls.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Betelhem_Dessie.jpg/256px-Betelhem_Dessie.jpg",
    occupation: "Web & Mobile Developer",
    techStack: ["React", "React Native", "Node.js", "Python", "AI/ML"],
    age: 23,
    country: "Ethiopia",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Betelhem_Dessie.jpg/256px-Betelhem_Dessie.jpg"
  },
  {
    id: "2",
    name: "Timnit Gebru",
    bio: "Leading AI researcher and ethicist, former co-lead of Google's Ethical AI team. Pioneering work on algorithmic bias and promoting diversity in AI research and development.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Timnit_Gebru.jpg/256px-Timnit_Gebru.jpg",
    occupation: "AI Researcher / Ethicist",
    techStack: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Ethics"],
    age: 39,
    country: "Ethiopia/US",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Timnit_Gebru.jpg/256px-Timnit_Gebru.jpg"
  },
  {
    id: "3",
    name: "Henok Tsegaye",
    bio: "Full-stack developer with expertise in modern web technologies. Building scalable applications and contributing to open-source projects that make development more accessible.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Henok_Tsegaye.jpg/256px-Henok_Tsegaye.jpg",
    occupation: "Full-stack Developer",
    techStack: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    age: 28,
    country: "Ethiopia",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Henok_Tsegaye.jpg/256px-Henok_Tsegaye.jpg"
  },
  {
    id: "4",
    name: "Lewam Kefela",
    bio: "Venture capital professional and design strategist, focusing on investing in African tech startups. Combining design thinking with business acumen to drive innovation.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Lewam_Kefela.jpg/256px-Lewam_Kefela.jpg",
    occupation: "Venture / Design & Investment",
    techStack: ["Design Thinking", "Figma", "Analytics", "Business Strategy", "Investment"],
    age: 31,
    country: "Ethiopia",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Lewam_Kefela.jpg/256px-Lewam_Kefela.jpg"
  },
  {
    id: "5",
    name: "Yadesa Bojia",
    bio: "Creative graphic designer and visual artist, known for blending traditional Ethiopian art with modern design principles. Creating visual narratives that celebrate African culture.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Yadesa_Bojia.jpg/256px-Yadesa_Bojia.jpg",
    occupation: "Graphic Designer / Artist",
    techStack: ["Photoshop", "Illustrator", "InDesign", "Traditional Art", "Branding"],
    age: 35,
    country: "Ethiopia",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Yadesa_Bojia.jpg/256px-Yadesa_Bojia.jpg"
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
