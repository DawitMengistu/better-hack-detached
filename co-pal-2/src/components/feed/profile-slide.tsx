"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconX, IconCode, IconStar, IconMapPin, IconCalendar, IconTrendingUp, IconEye, IconExternalLink, IconClock, IconUsers, IconCoins, IconUserCheck } from "@tabler/icons-react";
import { UserProfile } from "./user-card";
import { toast } from "sonner";

interface ProfileSlideProps {
    user: UserProfile | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileSlide({ user, isOpen, onClose }: ProfileSlideProps) {
    const [activeTab, setActiveTab] = useState("Creations");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
    const [userBalance, setUserBalance] = useState(150); // Mock user balance

    const tabs = ["Creations", "Softskills", "Testimonials", "Stars"];
    const CONNECTION_COST = 25; // Cost in connects to connect with someone

    const filters = {
        Creations: ["All", "Web", "AI", "UI / UX", "Product design", "Graphic", "Webflow", "3D"],
        Softskills: ["All", "Marketing", "Personality", "Writing", "Consultation"],
        Testimonials: ["All", "Positive", "Critical", "5★", "4★", "3★"],
        Stars: ["All", "Positive", "Critical", "5★", "4★", "3★"]
    };

    // User-specific creations data with different project counts per profession
    const getUserCreations = (userId: string) => {
        switch (userId) {
            case "1": // Betelhem Dessie - Web & Mobile Developer (3 projects)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                        ],
                        title: "Robotics Education Platform",
                        description: "Mobile app teaching robotics to young girls in Ethiopia. Features interactive tutorials, AR robot assembly, and community challenges.",
                        link: "https://github.com/betelhem/robotics-app",
                        category: "Web",
                        views: 3247,
                        stars: 289,
                        time: "45d",
                        collaborators: 8
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop"
                        ],
                        title: "Ethiopian Language Learning App",
                        description: "Cross-platform mobile app for learning Amharic, Oromo, and Tigrinya languages with AI-powered pronunciation assistance.",
                        link: "https://github.com/betelhem/lang-learn",
                        category: "Web",
                        views: 1892,
                        stars: 156,
                        time: "67d",
                        collaborators: 5
                    },
                    {
                        id: 3,
                        images: [
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                        ],
                        title: "Girls in Tech Ethiopia",
                        description: "Community platform connecting young women in tech across Ethiopia. Features mentorship matching and project collaboration tools.",
                        link: "https://girls-in-tech-et.com",
                        category: "Web",
                        views: 1567,
                        stars: 234,
                        time: "12d",
                        collaborators: 12
                    }
                ];
            case "2": // Timnit Gebru - AI Researcher / Ethicist (2 projects - focused on research)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop"
                        ],
                        title: "Algorithmic Bias Detection Tool",
                        description: "Open-source framework for detecting and mitigating bias in machine learning models. Used by major tech companies worldwide.",
                        link: "https://github.com/timnit/bias-detector",
                        category: "AI",
                        views: 8934,
                        stars: 1247,
                        time: "234d",
                        collaborators: 23
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                        ],
                        title: "Black in AI Organization",
                        description: "Founding member of Black in AI, supporting Black researchers in artificial intelligence through community and resources.",
                        link: "https://blackinai.github.io",
                        category: "AI",
                        views: 6789,
                        stars: 445,
                        time: "789d",
                        collaborators: 156
                    }
                ];
            case "3": // Henok Tsegaye - Full-stack Developer (3 projects - active developer)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                        ],
                        title: "Ethiopian Market Analytics Platform",
                        description: "Real-time analytics dashboard for Ethiopian businesses. Features market trends, consumer behavior insights, and predictive analytics.",
                        link: "https://github.com/henok/ethiopia-analytics",
                        category: "Web",
                        views: 2341,
                        stars: 189,
                        time: "89d",
                        collaborators: 6
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
                        ],
                        title: "AgriTech Mobile Solution",
                        description: "Full-stack application connecting Ethiopian farmers with buyers. Features real-time pricing, logistics tracking, and payment processing.",
                        link: "https://github.com/henok/agritech-app",
                        category: "Web",
                        views: 3456,
                        stars: 267,
                        time: "123d",
                        collaborators: 9
                    },
                    {
                        id: 3,
                        images: [
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                        ],
                        title: "Open Source Developer Tools",
                        description: "Collection of developer tools and utilities for Ethiopian tech community. Includes local payment integrations and SMS services.",
                        link: "https://github.com/henok/ethiopia-dev-tools",
                        category: "Web",
                        views: 1789,
                        stars: 134,
                        time: "67d",
                        collaborators: 4
                    }
                ];
            case "4": // Lewam Kefela - Venture / Design & Investment (2 projects - strategic focus)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop"
                        ],
                        title: "African Startup Investment Portfolio",
                        description: "Strategic investment portfolio focusing on African tech startups. Includes design thinking workshops and mentorship programs.",
                        link: "https://african-startups-portfolio.com",
                        category: "Product design",
                        views: 4567,
                        stars: 234,
                        time: "345d",
                        collaborators: 15
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
                        ],
                        title: "Design Thinking for African Markets",
                        description: "Comprehensive guide and workshop series on applying design thinking principles to African market challenges and opportunities.",
                        link: "https://design-thinking-africa.com",
                        category: "UI / UX",
                        views: 2890,
                        stars: 156,
                        time: "234d",
                        collaborators: 8
                    }
                ];
            case "5": // Yadesa Bojia - Graphic Designer / Artist (3 projects - creative portfolio)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
                        ],
                        title: "Ethiopian Cultural Heritage Series",
                        description: "Digital art collection celebrating Ethiopian traditions, featuring modern interpretations of ancient symbols and patterns.",
                        link: "https://yadesa-art.com/cultural-heritage",
                        category: "Graphic",
                        views: 5678,
                        stars: 345,
                        time: "123d",
                        collaborators: 3
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
                        ],
                        title: "African Tech Branding Guidelines",
                        description: "Comprehensive branding system for African tech companies, incorporating traditional aesthetics with modern design principles.",
                        link: "https://african-tech-branding.com",
                        category: "UI / UX",
                        views: 2345,
                        stars: 178,
                        time: "89d",
                        collaborators: 7
                    },
                    {
                        id: 3,
                        images: [
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                        ],
                        title: "Digital Art Exhibition: 'Modern Ethiopia'",
                        description: "Virtual exhibition showcasing contemporary Ethiopian art through digital mediums, exploring identity and technology.",
                        link: "https://modern-ethiopia-art.com",
                        category: "Graphic",
                        views: 6789,
                        stars: 456,
                        time: "234d",
                        collaborators: 12
                    }
                ];
            case "6": // KinfeMichael Tariku - Founding Engineer / Co-Founder (2 projects - focused on auth and maps)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                        ],
                        title: "Better Auth - Next-Gen Authentication",
                        description: "Revolutionary authentication platform providing secure, scalable solutions for modern applications. Built with cutting-edge security practices.",
                        link: "https://better-auth.com",
                        category: "Web",
                        views: 12456,
                        stars: 892,
                        time: "234d",
                        collaborators: 4
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
                        ],
                        title: "Gebeta Maps - Ethiopian Navigation",
                        description: "Comprehensive mapping solution for Ethiopia, featuring local landmarks, traffic data, and navigation optimized for Ethiopian roads.",
                        link: "https://gebetamaps.com",
                        category: "Web",
                        views: 8934,
                        stars: 567,
                        time: "456d",
                        collaborators: 8
                    }
                ];
            case "7": // Dagmawi Esayas - Software Engineer / Entrepreneur (3 projects - diverse solutions)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                        ],
                        title: "Ethiopian Business Automation Suite",
                        description: "Comprehensive business management platform designed specifically for Ethiopian enterprises, featuring local payment integration and compliance tools.",
                        link: "https://github.com/dagmawi/business-automation",
                        category: "Web",
                        views: 3456,
                        stars: 234,
                        time: "123d",
                        collaborators: 6
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
                        ],
                        title: "Microservices Architecture Framework",
                        description: "Scalable microservices framework optimized for Ethiopian infrastructure, featuring Docker containerization and AWS deployment.",
                        link: "https://github.com/dagmawi/microservices-framework",
                        category: "Web",
                        views: 5678,
                        stars: 345,
                        time: "189d",
                        collaborators: 5
                    },
                    {
                        id: 3,
                        images: [
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                        ],
                        title: "Digital Transformation Toolkit",
                        description: "Comprehensive toolkit helping Ethiopian businesses transition to digital operations, including training modules and implementation guides.",
                        link: "https://digital-transformation-et.com",
                        category: "Web",
                        views: 2345,
                        stars: 178,
                        time: "67d",
                        collaborators: 9
                    }
                ];
            case "8": // Temkin Mengistu - Full-Stack Developer / Tech Mentor (2 projects - education focus)
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                        ],
                        title: "Ethiopian Developer Academy",
                        description: "Online learning platform teaching modern web development to Ethiopian students, featuring Amharic language support and local project examples.",
                        link: "https://ethiopian-dev-academy.com",
                        category: "Web",
                        views: 7890,
                        stars: 456,
                        time: "345d",
                        collaborators: 12
                    },
                    {
                        id: 2,
                        images: [
                            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
                        ],
                        title: "Open Source Mentorship Platform",
                        description: "Platform connecting experienced developers with Ethiopian students, facilitating mentorship relationships and collaborative learning.",
                        link: "https://github.com/temkin/mentorship-platform",
                        category: "Web",
                        views: 4567,
                        stars: 289,
                        time: "234d",
                        collaborators: 15
                    }
                ];
            default:
                return [
                    {
                        id: 1,
                        images: [
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop"
                        ],
                        title: "Sample Project",
                        description: "This is a sample project description.",
                        link: "#",
                        category: "Web",
                        views: 100,
                        stars: 10,
                        time: "1hr",
                        collaborators: 1
                    }
                ];
        }
    };

    const creations = getUserCreations(user?.id || "");

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    // Connection handlers
    const handleConnectClick = () => {
        if (!user) return;

        if (connectedUsers.has(user.id)) {
            // User is already connected, show unfollow option
            handleUnfollow();
            return;
        }

        setIsConnectionModalOpen(true);
    };

    const handleConnect = async () => {
        if (!user) return;

        if (userBalance < CONNECTION_COST) {
            toast.error("Insufficient balance! Buy more connects to continue.");
            setIsConnectionModalOpen(false);
            return;
        }

        setIsConnecting(true);

        try {
            // Simulate API call to connect
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Deduct balance and add to connected users
            setUserBalance(prev => prev - CONNECTION_COST);
            setConnectedUsers(prev => new Set([...prev, user.id]));

            toast.success(`Successfully connected with ${user.name}!`);
            setIsConnectionModalOpen(false);
        } catch (error) {
            toast.error("Failed to connect. Please try again.");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleUnfollow = async () => {
        if (!user) return;

        try {
            // Simulate API call to unfollow
            await new Promise(resolve => setTimeout(resolve, 800));

            setConnectedUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(user.id);
                return newSet;
            });

            toast.success(`Unfollowed ${user.name}`);
        } catch (error) {
            toast.error("Failed to unfollow. Please try again.");
        }
    };

    const handleCancelConnection = () => {
        setIsConnectionModalOpen(false);
    };

    // Prevent body scroll when slide is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset filter when switching tabs
    useEffect(() => {
        setSelectedFilter("All");
    }, [activeTab]);

    if (!isOpen || !user) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Slide Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h1 className="text-lg font-semibold text-foreground">Profile</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <IconX className="w-4 h-4" />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto h-[calc(100vh-60px)] overflow-x-hidden">
                    {/* Profile Header */}
                    <div className="m-2 mb-0">
                        <div className="p-2">
                            {/* Top Section */}
                            <div className="flex items-start space-x-4 mb-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-lg font-semibold">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
                                    <p className="text-sm text-muted-foreground mb-2">Developer</p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="text-foreground font-medium">21.k . 123 posts</span>

                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <p className="text-sm text-foreground">
                                    {user.bio}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleConnectClick}
                                    className="flex-1 h-9 rounded-full"
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Connecting...
                                        </div>
                                    ) : connectedUsers.has(user.id) ? (
                                        <div className="flex items-center gap-2">
                                            <IconUserCheck className="w-4 h-4" />
                                            Unfollow
                                        </div>
                                    ) : (
                                        "Connect"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Tab Navigation */}
                    <div className="navigation px-4">
                        <div className="flex space-x-1 border-b border-border">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 px-4 py-2">
                        {/* Filter Bar */}
                        <div className="mb-4">
                            <div
                                className="flex space-x-2 overflow-x-auto pb-2"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    // WebkitScrollbar: { display: 'none' }
                                }}
                            >
                                {filters[activeTab as keyof typeof filters]?.map((filter) => (
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
                        {/* Content */}
                        <div>
                            {activeTab === "Creations" && (
                                <div>
                                    {/* Creations Grid */}
                                    <div className="space-y-4">
                                        {creations
                                            .filter(creation => selectedFilter === "All" || creation.category === selectedFilter)
                                            .map((creation) => (
                                                <div key={creation.id} className="border border-border rounded-lg overflow-hidden bg-card">
                                                    {/* Images */}
                                                    {creation.images && creation.images.length > 0 && (
                                                        <div className="aspect-video w-full overflow-hidden relative">
                                                            <img
                                                                src={creation.images[(currentImageIndices[creation.id] || 0) % creation.images.length]}
                                                                alt={creation.title}
                                                                className="w-full h-full object-cover cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (creation.images.length > 1) {
                                                                        setCurrentImageIndices((prev) => ({
                                                                            ...prev,
                                                                            [creation.id]: ((prev[creation.id] || 0) + 1) % creation.images.length
                                                                        }));
                                                                    }
                                                                }}
                                                            />

                                                            {/* Image Navigation */}
                                                            {creation.images.length > 1 && (
                                                                <div className="absolute bottom-2 right-2 flex space-x-1">
                                                                    {creation.images.map((_, index) => (
                                                                        <button
                                                                            key={index}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setCurrentImageIndices((prev) => ({
                                                                                    ...prev,
                                                                                    [creation.id]: index
                                                                                }));
                                                                            }}
                                                                            className={`w-2 h-2 rounded-full transition-colors ${index === ((currentImageIndices[creation.id] || 0) % creation.images.length)
                                                                                ? "bg-white"
                                                                                : "bg-white/50"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="p-4">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="text-base font-semibold text-foreground">{creation.title}</h4>
                                                            <a
                                                                href={creation.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                <IconExternalLink className="w-4 h-4" />
                                                            </a>
                                                        </div>

                                                        <p className="text-sm text-muted-foreground mb-3">{creation.description}</p>

                                                        {/* Stats */}
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex items-center space-x-1 px-2 py-1 rounded-md border border-border">
                                                                <IconEye className="w-3 h-3" />
                                                                <span className="text-xs">{creation.views}</span>
                                                            </div>

                                                            <div className="flex items-center space-x-1 px-2 py-1 rounded-md border border-border">
                                                                <IconStar className="w-3 h-3 fill-current" />
                                                                <span className="text-xs">{creation.stars}</span>
                                                            </div>

                                                            <div className="flex items-center space-x-1 px-2 py-1 rounded-md border border-border">
                                                                <IconClock className="w-3 h-3" />
                                                                <span className="text-xs">{creation.time}</span>
                                                            </div>

                                                            <div className="flex items-center space-x-1 px-2 py-1 rounded-md border border-border">
                                                                <IconUsers className="w-3 h-3" />
                                                                <span className="text-xs">{creation.collaborators}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "Softskills" && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Soft Skills - {selectedFilter}</h3>
                                    <p className="text-muted-foreground">Communication, teamwork, and other soft skills information.</p>
                                </div>
                            )}

                            {activeTab === "Testimonials" && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Testimonials - {selectedFilter}</h3>
                                    <p className="text-muted-foreground">Reviews and testimonials from collaborators and clients.</p>
                                </div>
                            )}

                            {activeTab === "Stars" && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">Stars - {selectedFilter}</h3>
                                    <p className="text-muted-foreground">Achievements, badges, and recognition received.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Connection Modal */}
            {isConnectionModalOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
                        onClick={handleCancelConnection}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="bg-background rounded-lg shadow-2xl max-w-sm w-full p-6 border border-border">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                    <IconCoins className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Connect with {user?.name}</h3>
                                    <p className="text-sm text-muted-foreground">This action will cost you connects</p>
                                </div>
                            </div>

                            {/* Cost Info */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Connection Cost</span>
                                    <span className="text-lg font-semibold text-foreground">{CONNECTION_COST} connects</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Your Balance</span>
                                    <span className="text-sm font-medium text-foreground">{userBalance} connects</span>
                                </div>
                                {userBalance < CONNECTION_COST && (
                                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            Insufficient balance. You need {CONNECTION_COST - userBalance} more connects.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleCancelConnection}
                                    variant="outline"
                                    className="flex-1"
                                    disabled={isConnecting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConnect}
                                    className="flex-1"
                                    disabled={isConnecting || userBalance < CONNECTION_COST}
                                >
                                    {isConnecting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Connecting...
                                        </div>
                                    ) : (
                                        `Connect (${CONNECTION_COST} connects)`
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
