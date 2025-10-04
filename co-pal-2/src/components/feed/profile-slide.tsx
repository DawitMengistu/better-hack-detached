"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconX, IconCode, IconStar, IconMapPin, IconCalendar, IconTrendingUp, IconEye, IconExternalLink, IconClock, IconUsers } from "@tabler/icons-react";
import { UserProfile } from "./user-card";

interface ProfileSlideProps {
    user: UserProfile | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileSlide({ user, isOpen, onClose }: ProfileSlideProps) {
    const [activeTab, setActiveTab] = useState("Creations");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

    const tabs = ["Creations", "Softskills", "Testimonials", "Stars"];

    const filters = {
        Creations: ["All", "Webflow", "UI / UX", "Web", "Product design", "3D"],
        Softskills: ["All", "Marketing", "Personality", "Writing", "Consultation"],
        Testimonials: ["All", "Positive", "Critical", "5★", "4★", "3★"],
        Stars: ["All", "Positive", "Critical", "5★", "4★", "3★"]
    };

    // Sample creations data
    const creations = [
        {
            id: 1,
            images: [
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
            ],
            title: "E-commerce Dashboard",
            description: "Modern admin dashboard built with React and TypeScript. Features real-time analytics, user management, and responsive design.",
            link: "https://github.com/user/dashboard",
            category: "Web",
            views: 1247,
            stars: 89,
            time: "5hr",
            collaborators: 3
        },
        {
            id: 2,
            images: [
                "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop"
            ],
            title: "Mobile App UI Kit",
            description: "Complete UI component library for mobile applications. Includes 50+ components with dark/light themes.",
            link: "https://github.com/user/ui-kit",
            category: "UI / UX",
            views: 892,
            stars: 156,
            time: "23d",
            collaborators: 2
        },
        {
            id: 3,
            images: null,
            title: "API Documentation",
            description: "Comprehensive REST API documentation with interactive examples and authentication guides.",
            link: "https://docs.example.com",
            category: "Web",
            views: 2341,
            stars: 67,
            time: "12d",
            collaborators: 0
        },
        {
            id: 4,
            images: [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
            ],
            title: "Data Visualization Tool",
            description: "Interactive charts and graphs library built with D3.js. Perfect for analytics dashboards and reports.",
            link: "https://github.com/user/charts",
            category: "Web",
            views: 567,
            stars: 234,
            time: "3hr",
            collaborators: 1
        },
        {
            id: 5,
            images: [
                "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
            ],
            title: "3D Product Showcase",
            description: "Three.js powered 3D product viewer for e-commerce websites. Features smooth animations and realistic lighting.",
            link: "https://github.com/user/3d-viewer",
            category: "3D",
            views: 445,
            stars: 123,
            time: "7hr",
            collaborators: 3
        },
        {
            id: 6,
            images: [
                "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop"
            ],
            title: "Webflow Portfolio",
            description: "Beautiful portfolio website built with Webflow. Features smooth animations and responsive design.",
            link: "https://webflow.io/portfolio",
            category: "Webflow",
            views: 789,
            stars: 45,
            time: "2hr",
            collaborators: 0
        },
        {
            id: 7,
            images: [
                "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop"
            ],
            title: "Product Design System",
            description: "Comprehensive design system for mobile and web applications with reusable components.",
            link: "https://figma.com/design-system",
            category: "Product design",
            views: 1123,
            stars: 78,
            time: "15d",
            collaborators: 2
        }
    ];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
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
                                <Button className="flex-1 h-9 rounded-full">Connect</Button>
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
        </>
    );
}
