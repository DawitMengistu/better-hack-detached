"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconArrowLeft, IconSend } from "@tabler/icons-react";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Dummy chat data
const dummyChats = [
    {
        id: 1,
        user: {
            name: "Alex Chen",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            status: "active"
        },
        lastMessage: "Hey! I saw your latest project on GitHub. The UI looks amazing!",
        timestamp: "11:32 PM",
        messages: [
            { id: 1, sender: "them", text: "Hi! I'm interested in collaborating on your React project", time: "10:15 PM" },
            { id: 2, sender: "me", text: "That sounds great! What kind of collaboration are you thinking?", time: "10:18 PM" },
            { id: 3, sender: "them", text: "I could help with the backend integration and API design", time: "10:22 PM" },
            { id: 4, sender: "me", text: "Perfect! I've been struggling with the API structure", time: "10:25 PM" },
            { id: 5, sender: "them", text: "Hey! I saw your latest project on GitHub. The UI looks amazing!", time: "11:32 PM" }
        ]
    },
    {
        id: 2,
        user: {
            name: "Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
            status: "inactive"
        },
        lastMessage: "Thanks for the feedback on my portfolio!",
        timestamp: "9:45 PM",
        messages: [
            { id: 1, sender: "them", text: "Hi! I'd love to get your feedback on my portfolio design", time: "8:30 PM" },
            { id: 2, sender: "me", text: "I'd be happy to help! Send me the link", time: "8:35 PM" },
            { id: 3, sender: "them", text: "Here it is: https://myportfolio.com", time: "8:36 PM" },
            { id: 4, sender: "me", text: "Just reviewed it - looks great! The animations are smooth", time: "9:40 PM" },
            { id: 5, sender: "them", text: "Thanks for the feedback on my portfolio!", time: "9:45 PM" }
        ]
    },
    {
        id: 3,
        user: {
            name: "Mike Rodriguez",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            status: "active"
        },
        lastMessage: "Let's schedule a call to discuss the project timeline",
        timestamp: "8:20 PM",
        messages: [
            { id: 1, sender: "me", text: "Hi Mike! I'm interested in your freelance services", time: "7:45 PM" },
            { id: 2, sender: "them", text: "Great to hear from you! What kind of project are you working on?", time: "7:50 PM" },
            { id: 3, sender: "me", text: "I need help with a full-stack web application", time: "7:52 PM" },
            { id: 4, sender: "them", text: "Perfect! I specialize in React and Node.js", time: "8:15 PM" },
            { id: 5, sender: "them", text: "Let's schedule a call to discuss the project timeline", time: "8:20 PM" }
        ]
    }
];

export default function ChatsPage() {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [selectedChat, setSelectedChat] = useState<typeof dummyChats[0] | null>(null);

    const filters = ["All", "Active", "Inactive"];

    const filteredChats = dummyChats.filter(chat => {
        if (selectedFilter === "All") return true;
        return chat.user.status === selectedFilter.toLowerCase();
    });

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    if (selectedChat) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background pb-16">
                    <div className="max-w-sm mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedChat(null)}
                                className="h-8 w-8 p-0"
                            >
                                <IconArrowLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedChat.user.avatar} alt={selectedChat.user.name} />
                                    <AvatarFallback className="text-xs">
                                        {getInitials(selectedChat.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-lg font-semibold text-foreground">{selectedChat.user.name}</h1>
                                </div>
                            </div>
                            <div className="w-8" /> {/* Spacer */}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedChat.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${message.sender === "me"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                                            }`}>
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <Button size="sm" className="h-9 w-9 p-0">
                                    <IconSend className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background pb-16">
                <div className="max-w-sm mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground mb-2">Your chats</h1>

                        {/* Filter Bar */}
                        <div className="flex space-x-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="[&::-webkit-scrollbar]:hidden">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${selectedFilter === filter
                                        ? "bg-white text-black"
                                        : "bg-transparent border border-white text-white hover:bg-white/10"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="space-y-4">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedChat(chat)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                                    <AvatarFallback>
                                        {getInitials(chat.user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-foreground truncate">
                                        {chat.user.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {chat.lastMessage}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                        {chat.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
