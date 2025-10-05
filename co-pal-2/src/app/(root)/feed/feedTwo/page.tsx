"use client";

import SwipeableCardStack, { CardData } from "@/components/SwipeableCardStack";
import TopBar from "@/components/TopBar";
import BottomNavigation from "@/components/BottomNavigation";

// Sample data - you can replace this with real data
const sampleCards: CardData[] = [
    {
        id: 1,
        images: [
            "/Untitled.png",
            "/Untitled.png",
            "/Untitled.png"
        ],
        title: "Alex Johnson",
        description: "Photographer & Travel Enthusiast",
        age: 28,
        location: "New York, NY",
        verified: true,
        preferences: ["Long-term partner", "Better in person", "Non-smoker"]
    },
    {
        id: 2,
        images: [
            "/Untitled.png",
            "/Untitled.png"
        ],
        title: "Sarah Chen",
        description: "Software Engineer & Coffee Lover",
        age: 26,
        location: "San Francisco, CA",
        verified: false,
        preferences: ["Coffee dates", "Tech talks", "Hiking"]
    },
    {
        id: 3,
        images: [
            "/Untitled.png",
            "/Untitled.png",
            "/Untitled.png"
        ],
        title: "Michael Rodriguez",
        description: "Chef & Food Blogger",
        age: 32,
        location: "Los Angeles, CA",
        verified: true,
        preferences: ["Foodie", "Cooking together", "Wine tasting"]
    },
    {
        id: 4,
        images: [
            "/Untitled.png"
        ],
        title: "Emma Wilson",
        description: "Artist & Yoga Instructor",
        age: 29,
        location: "Portland, OR",
        verified: false,
        preferences: ["Yoga", "Art galleries", "Meditation"]
    },
    {
        id: 5,
        images: [
            "/Untitled.png",
            "/Untitled.png"
        ],
        title: "David Kim",
        description: "Musician & Producer",
        age: 31,
        location: "Austin, TX",
        verified: true,
        preferences: ["Music", "Concerts", "Creative projects"]
    }
];

export default function FeedPage() {
    const handleSwipeLeft = (card: CardData) => {
        console.log("Passed on:", card.title);
    };

    const handleSwipeRight = (card: CardData) => {
        console.log("Liked:", card.title);
    };

    const handleAllCardsSwiped = () => {
        console.log("All cards have been swiped!");
    };

    return (
        <div className="min-h-screen bg-black">
            <TopBar title="Feed" />

            <div className="pt-24 pb-20 px-4 h-screen">
                <div className=" h-full">
                    <SwipeableCardStack
                        cards={sampleCards}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        onAllCardsSwiped={handleAllCardsSwiped}
                        maxVisibleCards={3}
                        className="mx-auto h-full"
                    />
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
}
