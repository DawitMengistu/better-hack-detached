"use client";

import { useState, useRef, useEffect } from "react";
import { UserCard, UserProfile } from "./user-card";
import { ProfileSlide } from "./profile-slide";

interface SwipeableCardStackProps {
    users: UserProfile[];
    onSwipeLeft?: (user: UserProfile) => void;
    onSwipeRight?: (user: UserProfile) => void;
    onAllCardsSwiped?: () => void;
    maxVisibleCards?: number;
    className?: string;
    onCardClick?: (user: UserProfile) => void;
}

interface CardPosition {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
}

export function SwipeableCardStack({
    users,
    onSwipeLeft,
    onSwipeRight,
    onAllCardsSwiped,
    maxVisibleCards = 3,
    className = "",
    onCardClick,
}: SwipeableCardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const visibleUsers = users.slice(currentIndex, currentIndex + maxVisibleCards);
    const hasMoreCards = currentIndex < users.length;

    useEffect(() => {
        if (currentIndex >= users.length && onAllCardsSwiped) {
            onAllCardsSwiped();
        }
    }, [currentIndex, users.length, onAllCardsSwiped]);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (isAnimating) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        setDragStart({ x: clientX, y: clientY });
        setDragCurrent({ x: clientX, y: clientY });
        setIsDragging(true);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !dragStart) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        setDragCurrent({ x: clientX, y: clientY });
    };

    const handleDragEnd = () => {
        if (!isDragging || !dragStart || !dragCurrent) return;

        const deltaX = dragCurrent.x - dragStart.x;
        const deltaY = dragCurrent.y - dragStart.y;
        const threshold = 100;

        setIsDragging(false);
        setDragStart(null);
        setDragCurrent(null);

        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                // Swipe right
                handleSwipeRight();
            } else {
                // Swipe left
                handleSwipeLeft();
            }
        }
    };

    const handleSwipeLeft = () => {
        if (isAnimating || currentIndex >= users.length) return;

        setIsAnimating(true);
        const currentUser = users[currentIndex];

        if (onSwipeLeft) {
            onSwipeLeft(currentUser);
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setIsAnimating(false);
        }, 300);
    };

    const handleSwipeRight = () => {
        if (isAnimating || currentIndex >= users.length) return;

        setIsAnimating(true);
        const currentUser = users[currentIndex];

        if (onSwipeRight) {
            onSwipeRight(currentUser);
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setIsAnimating(false);
        }, 300);
    };

    const handleCardClick = (user: UserProfile) => {
        if (isDragging) return;

        setSelectedUser(user);
        setIsModalOpen(true);

        if (onCardClick) {
            onCardClick(user);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const getCardStyle = (index: number): CardPosition => {
        const baseIndex = index;
        const isActive = baseIndex === 0;

        if (isDragging && isActive && dragStart && dragCurrent) {
            const deltaX = dragCurrent.x - dragStart.x;
            const deltaY = dragCurrent.y - dragStart.y;
            const rotation = deltaX * 0.1;
            const scale = Math.max(0.95, 1 - Math.abs(deltaX) * 0.0005);

            return {
                x: deltaX,
                y: deltaY,
                rotation,
                scale,
                opacity: 1,
            };
        }

        if (isAnimating && isActive) {
            return {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 0.8,
                opacity: 0,
            };
        }

        // Only show the active card, hide others
        if (baseIndex === 0) {
            return {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
            };
        }

        // Hide non-active cards
        return {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 0,
        };
    };

    const getBorderColor = () => {
        if (isDragging && dragStart && dragCurrent) {
            const deltaX = dragCurrent.x - dragStart.x;
            const threshold = 50; // Minimum distance for color change
            const intensity = Math.min(Math.abs(deltaX) / 100, 1); // Intensity based on distance

            if (deltaX > threshold) {
                const shadowIntensity = 0.4 + (intensity * 0.6); // Dynamic shadow intensity
                const ringIntensity = 0.2 + (intensity * 0.4); // Dynamic ring intensity
                return `border-green-500 shadow-[0_0_${20 + intensity * 30}px_rgba(34,197,94,${shadowIntensity})] shadow-green-500/50 ring-2 ring-green-500/${ringIntensity * 100}`; // Swipe right (like)
            } else if (deltaX < -threshold) {
                const shadowIntensity = 0.4 + (intensity * 0.6); // Dynamic shadow intensity
                const ringIntensity = 0.2 + (intensity * 0.4); // Dynamic ring intensity
                return `border-red-500 shadow-[0_0_${20 + intensity * 30}px_rgba(239,68,68,${shadowIntensity})] shadow-red-500/50 ring-2 ring-red-500/${ringIntensity * 100}`; // Swipe left (pass)
            }
        }
        return "border-border shadow-lg"; // Default border with subtle shadow
    };

    if (!hasMoreCards) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-center text-muted-foreground">
                    <p className="text-xl font-semibold mb-2">No more profiles!</p>
                    <p className="text-sm">Check back later for new connections.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Swipeable Cards Container */}
            <div className="flex-1 h-full">
                {visibleUsers.map((user, index) => {
                    const style = getCardStyle(index);
                    const isActive = index === 0;

                    // Only render the active card
                    if (index !== 0) return null;

                    return (
                        <div
                            key={`${user.id}-${currentIndex + index}`}
                            ref={isActive ? cardRef : null}
                            className={`w-full transition-all duration-300 ease-out ${getBorderColor()} border-4 rounded-lg relative z-10`}
                            style={{
                                transform: `translate(${style.x}px, ${style.y}px) rotate(${style.rotation}deg) scale(${style.scale})`,
                                opacity: style.opacity,
                            }}
                            onMouseDown={isActive ? handleDragStart : undefined}
                            onMouseMove={isActive && isDragging ? handleDragMove : undefined}
                            onMouseUp={isActive ? handleDragEnd : undefined}
                            onMouseLeave={isActive ? handleDragEnd : undefined}
                            onTouchStart={isActive ? handleDragStart : undefined}
                            onTouchMove={isActive && isDragging ? handleDragMove : undefined}
                            onTouchEnd={isActive ? handleDragEnd : undefined}
                        >
                            <UserCard
                                user={user}
                                onClick={handleCardClick}
                            />
                        </div>
                    );
                })}
            </div>


            {/* Profile Modal */}
            <ProfileSlide
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
