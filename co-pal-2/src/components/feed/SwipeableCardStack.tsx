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
    currentUserId?: string;
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
    currentUserId = 'current-user-id',
}: SwipeableCardStackProps) {
    console.log(`🎯 [SWIPEABLE] Received currentUserId: ${currentUserId}`);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());
    const [passedUsers, setPassedUsers] = useState<Set<string>>(new Set());

    const cardRef = useRef<HTMLDivElement>(null);

    const visibleUsers = users.slice(currentIndex, currentIndex + maxVisibleCards);
    const hasMoreCards = currentIndex < users.length;

    // Async function to store liked user (fire-and-forget)
    const storeLikedUser = (user: UserProfile) => {
        // Add to local state immediately for UI feedback
        setLikedUsers(prev => new Set([...prev, user.id]));

        // Fire-and-forget API call - don't await
        fetch('/api/user-interactions/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUserId,
                likedId: user.id
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.isMatch) {
                    console.log(`🎉 MATCH! You and ${user.name} liked each other!`);
                    // You can add match notification logic here
                }
                console.log(`✅ Liked user: ${user.name} (${user.id})`);
            })
            .catch(error => {
                console.error('Failed to store liked user:', error);
                // Remove from local state if API call failed
                setLikedUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(user.id);
                    return newSet;
                });
            });
    };

    // Async function to store passed user (fire-and-forget)
    const storePassedUser = (user: UserProfile) => {
        // Add to local state immediately for UI feedback
        setPassedUsers(prev => new Set([...prev, user.id]));

        // Fire-and-forget API call - don't await
        fetch('/api/user-interactions/pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUserId,
                passedId: user.id
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(`❌ Passed user: ${user.name} (${user.id})`);
            })
            .catch(error => {
                console.error('Failed to store passed user:', error);
                // Remove from local state if API call failed
                setPassedUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(user.id);
                    return newSet;
                });
            });
    };

    useEffect(() => {
        if (currentIndex >= users.length && onAllCardsSwiped) {
            onAllCardsSwiped();
        }
    }, [currentIndex, users.length, onAllCardsSwiped]);

    // Load existing matches from backend on mount (fire-and-forget)
    useEffect(() => {
        // Fire-and-forget API call to load matches
        fetch(`/api/user-interactions/matches?userId=${currentUserId}`)
            .then(response => response.json())
            .then(matchesData => {
                if (matchesData.success) {
                    console.log('📱 Loaded matches:', matchesData.matches.length);
                }
            })
            .catch(error => {
                console.error('Failed to load user preferences:', error);
            });
    }, []);

    // Keyboard event listeners for left/right arrow keys
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (isAnimating || currentIndex >= users.length) return;

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                handleSwipeLeft();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                handleSwipeRight();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isAnimating, currentIndex, users.length]);

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

        // Store passed user asynchronously (non-blocking)
        storePassedUser(currentUser);

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

        // Store liked user asynchronously (non-blocking)
        storeLikedUser(currentUser);

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
            const threshold = 30; // Lower threshold for earlier activation
            const intensity = Math.min(Math.abs(deltaX) / 80, 1); // Intensity based on distance

            if (deltaX > threshold) {
                const shadowIntensity = 0.8 + (intensity * 0.2); // Very high base intensity
                const blurRadius = 50 + (intensity * 80); // Even bigger blur radius (50-130px)
                return `shadow-[0_0_${blurRadius}px_rgba(34,197,94,${shadowIntensity}),0_0_${blurRadius * 1.8}px_rgba(34,197,94,${shadowIntensity * 0.7}),0_0_${blurRadius * 2.5}px_rgba(34,197,94,${shadowIntensity * 0.4})] shadow-green-500/80`; // Swipe right (like)
            } else if (deltaX < -threshold) {
                const shadowIntensity = 0.8 + (intensity * 0.2); // Very high base intensity
                const blurRadius = 50 + (intensity * 80); // Even bigger blur radius (50-130px)
                return `shadow-[0_0_${blurRadius}px_rgba(239,68,68,${shadowIntensity}),0_0_${blurRadius * 1.8}px_rgba(239,68,68,${shadowIntensity * 0.7}),0_0_${blurRadius * 2.5}px_rgba(239,68,68,${shadowIntensity * 0.4})] shadow-red-500/80`; // Swipe left (pass)
            }
        }
        return "shadow-lg"; // Just subtle shadow by default
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
            <div className="flex-1 h-full relative overflow-visible">
                {visibleUsers.map((user, index) => {
                    const style = getCardStyle(index);
                    const isActive = index === 0;

                    // Only render the active card
                    if (index !== 0) return null;

                    return (
                        <div
                            key={`${user.id}-${currentIndex + index}`}
                            ref={isActive ? cardRef : null}
                            className="w-full transition-all duration-200 ease-out rounded-lg relative z-10"
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
                                borderClass={getBorderColor()}
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
