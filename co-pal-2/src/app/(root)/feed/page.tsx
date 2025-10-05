"use client";

import { useState, useEffect } from "react";
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
  const [allUsers, setAllUsers] = useState<UserProfile[]>(sampleUsers);
  const [currentUserId, setCurrentUserId] = useState<string>('current-user-id');

  // Fetch real users from backend and add them to the feed
  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        console.log("🔍 [FEED] Fetching real users from backend");

        // Fetch all users from the database
        const response = await fetch('/api/test-data/users');
        const data = await response.json();

        if (data.success && data.users && data.users.length > 0) {
          console.log(`📊 [FEED] Found ${data.users.length} real users`);

          // Filter out current user (assuming first user is current user for demo)
          const fetchedCurrentUserId = data.users[0]?.id;
          const allUsersFromDB = data.users;
          const otherUsers = allUsersFromDB.filter((user: any) => user.id !== fetchedCurrentUserId);

          console.log(`👤 [FEED] Current user: ${fetchedCurrentUserId}`);
          console.log(`👥 [FEED] Total users from DB: ${allUsersFromDB.length}`);
          console.log(`🚫 [FEED] Filtering out current user (${fetchedCurrentUserId})`);
          console.log(`✅ [FEED] Other users after filtering: ${otherUsers.length}`);

          // Log the filtered users
          otherUsers.forEach((user: any, index: number) => {
            console.log(`   ${index + 1}. ${user.name} (${user.id})`);
          });

          // Update current user ID state
          if (fetchedCurrentUserId) {
            console.log(`🔄 [FEED] Setting current user ID from ${currentUserId} to ${fetchedCurrentUserId}`);
            setCurrentUserId(fetchedCurrentUserId);
          }

          // Take first 2 other users and create profiles for them (excluding current user)
          const realUsers: UserProfile[] = otherUsers.slice(0, 2).map((user: any, index: number) => ({
            id: user.id,
            name: user.name,
            bio: `Experienced full-stack developer with expertise in modern web technologies. Passionate about building scalable applications and contributing to open-source projects. ${index === 0 ? 'Specializes in frontend development and UI/UX design.' : 'Focuses on backend architecture and cloud infrastructure.'}`,
            avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            occupation: "Full-Stack Developer",
            techStack: index === 0 ? ["React", "TypeScript", "Next.js", "Tailwind CSS", "Figma"] : ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
            age: 28 + index,
            country: "Ethiopia",
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
          }));

          console.log(`✅ [FEED] Created ${realUsers.length} real user profiles`);

          // Add real users to the beginning of the sample users
          // Double-check: ensure current user is not in the final array
          const finalUsers = [...realUsers, ...sampleUsers];
          const filteredFinalUsers = finalUsers.filter(user => user.id !== fetchedCurrentUserId);

          console.log(`🎯 [FEED] Final users count: ${filteredFinalUsers.length} (after final filtering)`);
          setAllUsers(filteredFinalUsers);

        } else {
          console.log("⚠️ [FEED] No real users found, using only dummy data");
        }
      } catch (error) {
        console.error("💥 [FEED] Error fetching real users:", error);
        console.log("🔄 [FEED] Falling back to dummy data only");
      }
    };

    fetchRealUsers();
  }, []);

  console.log(`🎯 [FEED] Total users to display: ${allUsers.length}`);
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
        users={allUsers}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onAllCardsSwiped={handleAllCardsSwiped}
        onCardClick={handleCardClick}
        maxVisibleCards={1}
        className="h-full"
        currentUserId={currentUserId}
      />
    </div>
  );
}
