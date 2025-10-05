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
    avatar: "https://media.licdn.com/dms/image/v2/D4E22AQFdV5OlAEJanQ/feedshare-shrink_800/feedshare-shrink_800/0/1682073741589?e=2147483647&v=beta&t=NjvSCUK7wtiAdc-CZyvUZ37HUsIfLi_X3pxOnh7yogM",
    occupation: "Web & Mobile Developer",
    techStack: ["React", "React Native", "Node.js", "Python", "AI/ML"],
    age: 23,
    country: "Ethiopia",
    image: "https://media.licdn.com/dms/image/v2/D4E22AQFdV5OlAEJanQ/feedshare-shrink_800/feedshare-shrink_800/0/1682073741589?e=2147483647&v=beta&t=NjvSCUK7wtiAdc-CZyvUZ37HUsIfLi_X3pxOnh7yogM"
  },
  {
    id: "2",
    name: "Timnit Gebru",
    bio: "Leading AI researcher and ethicist, former co-lead of Google's Ethical AI team. Pioneering work on algorithmic bias and promoting diversity in AI research and development.",
    avatar: "https://radcliffe-harvard-edu.imgix.net/a7bba5e2-7668-44eb-be5d-03bed343dc0b/Timnit-Gebru_COURTESY.jpg",
    occupation: "AI Researcher / Ethicist",
    techStack: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Ethics"],
    age: 39,
    country: "Ethiopia/US",
    image: "https://radcliffe-harvard-edu.imgix.net/a7bba5e2-7668-44eb-be5d-03bed343dc0b/Timnit-Gebru_COURTESY.jpg"
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
    avatar: "https://partechpartners.com/_next/image?url=https%3A%2F%2Fpartech-admin.prod.unomena.io%2Fmedia%2Fimages%2FLewam_Kafela.format-webp.webp&w=3840&q=75",
    occupation: "Venture / Design & Investment",
    techStack: ["Design Thinking", "Figma", "Analytics", "Business Strategy", "Investment"],
    age: 31,
    country: "Ethiopia",
    image: "https://partechpartners.com/_next/image?url=https%3A%2F%2Fpartech-admin.prod.unomena.io%2Fmedia%2Fimages%2FLewam_Kafela.format-webp.webp&w=3840&q=75"
  },
  {
    id: "5",
    name: "Yadesa Bojia",
    bio: "Creative graphic designer and visual artist, known for blending traditional Ethiopian art with modern design principles. Creating visual narratives that celebrate African culture.",
    avatar: "https://images.squarespace-cdn.com/content/v1/5894e2861b10e3ecf54d5465/1521057709578-5WJSM0NUTAMPVR53W06F/Yaddie.jpg",
    occupation: "Graphic Designer / Artist",
    techStack: ["Photoshop", "Illustrator", "InDesign", "Traditional Art", "Branding"],
    age: 35,
    country: "Ethiopia",
    image: "https://images.squarespace-cdn.com/content/v1/5894e2861b10e3ecf54d5465/1521057709578-5WJSM0NUTAMPVR53W06F/Yaddie.jpg"
  },
  {
    id: "6",
    name: "KinfeMichael Tariku",
    bio: "Co-Founder and Founding Engineer at Better Auth, pioneering authentication solutions for modern applications. Former Frontend Engineer at Gebeta Maps, building innovative mapping technologies for Ethiopia.",
    avatar: "https://images.crunchbase.com/image/upload/c_thumb,h_680,w_680,f_auto,g_face,z_0.7,b_white,q_auto:eco,dpr_1/5076dac89a5f495684084a4c0303e5cf",
    occupation: "Founding Engineer / Co-Founder",
    techStack: ["React", "Node.js", "Authentication", "Frontend", "Maps API"],
    age: 28,
    country: "Ethiopia",
    image: "https://images.crunchbase.com/image/upload/c_thumb,h_680,w_680,f_auto,g_face,z_0.7,b_white,q_auto:eco,dpr_1/5076dac89a5f495684084a4c0303e5cf"
  },
  {
    id: "7",
    name: "Dagmawi Esayas",
    bio: "Innovative software engineer and tech entrepreneur, known for building scalable solutions for Ethiopian businesses. Passionate about using technology to solve local challenges and drive digital transformation.",
    avatar: "https://i.imgur.com/6YkKydE.png",
    occupation: "Software Engineer / Entrepreneur",
    techStack: ["Python", "JavaScript", "Docker", "AWS", "Microservices"],
    age: 30,
    country: "Ethiopia",
    image: "https://i.imgur.com/6YkKydE.png"
  },
  {
    id: "8",
    name: "Temkin Mengistu",
    bio: "Full-stack developer and tech mentor, dedicated to empowering the next generation of Ethiopian developers. Building educational platforms and contributing to open-source projects that benefit the local tech community.",
    avatar: "https://i.imgur.com/TSFDVcR.jpeg",
    occupation: "Full-Stack Developer / Tech Mentor",
    techStack: ["React", "Node.js", "MongoDB", "Teaching", "Open Source"],
    age: 32,
    country: "Ethiopia",
    image: "https://i.imgur.com/TSFDVcR.jpeg"
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
