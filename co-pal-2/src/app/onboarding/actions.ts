"use server";

import { PrismaClient } from "@prisma/client";
import { OnboardingFormData } from "@/lib/schemas/onboarding";

const prisma = new PrismaClient();

// Types for GitHub data
interface GitHubStats {
  totalContributions?: number;
  activeWeeks?: number;
  totalWeeks?: number;
  longestStreak?: number;
  averageWeeklyCommits?: number;
  topLanguage?: string;
  totalStars?: number;
  totalFollowers?: number;
}

interface ProfileData extends Omit<OnboardingFormData, 'name'> {
  name?: string;
}

/**
 * Creates a profile record for a user during onboarding and marks onboarding as complete
 */
export async function createProfileRecord(data: ProfileData, userId: string) {
  try {
    const { name, ...profileData } = data;

    // Update user name and mark onboarding as complete
    await prisma.user.update({
      where: { id: userId },
      data: { 
        ...(name && { name }),
        onBoardingComplete: true 
      },
    });

    // Create profile record
    const profile = await prisma.profile.create({
      data: {
        age: profileData.age,
        gender: profileData.gender,
        timeCommitment: profileData.timeCommitment,
        techStack: profileData.techStack,
        country: profileData.country,
        occupation: profileData.occupation,
        openForProjects: profileData.openForProjects,
        userId,
      },
    });

    console.log("✅ Profile created and onboarding marked as complete");
    return profile;
  } catch (error) {
    console.error("Error creating profile record:", error);
    throw new Error("Failed to create profile record");
  }
}

/**
 * Saves GitHub statistics data for a user
 */
export async function saveGitHubData(githubStats: GitHubStats, userId: string) {
  try {
    const githubData = {
      totalContributions: githubStats.totalContributions ?? 0,
      activeWeeks: githubStats.activeWeeks ?? 0,
      totalWeeks: githubStats.totalWeeks ?? 0,
      longestStreak: githubStats.longestStreak ?? 0,
      averageWeeklyCommits: githubStats.averageWeeklyCommits ?? 0,
      topLanguage: githubStats.topLanguage ?? "Unknown",
      totalStars: githubStats.totalStars ?? 0,
      totalFollowers: githubStats.totalFollowers ?? 0,
    };

    // Use upsert to handle both create and update cases
    const githubRecord = await prisma.gitHub.upsert({
      where: { userId },
      update: githubData,
      create: {
        ...githubData,
        userId,
      },
    });

    return githubRecord;
  } catch (error) {
    console.error("Error saving GitHub data:", error);
    throw new Error("Failed to save GitHub data");
  }
}

/**
 * Marks onboarding as complete for a user
 */
export async function completeOnboarding(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { onBoardingComplete: true },
    });

    return user;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}

/**
 * Checks if a user has completed onboarding
 */
export async function isOnboardingComplete(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onBoardingComplete: true },
    });

    return user?.onBoardingComplete ?? false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

/**
 * Checks if a user has completed onboarding
 */
export async function isProfileComplete(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onBoardingComplete: true,
      },
    });

    if (!user) return false;

    console.log("🌄👉: user onboarding status", user.onBoardingComplete);

    // Simply check if onboarding is complete
    return user.onBoardingComplete;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
}

/**
 * Checks if a user has set their preferences
 */
export async function arePreferencesSet(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferencesSet: true,
      },
    });

    if (!user) return false;

    console.log("🌄👉: user preferences status", user.preferencesSet);

    return user.preferencesSet;
  } catch (error) {
    console.error("Error checking preferences status:", error);
    return false;
  }
}

/**
 * Marks preferences as set for a user
 */
export async function markPreferencesSet(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferencesSet: true },
    });

    console.log("✅ Preferences marked as set");
    return user;
  } catch (error) {
    console.error("Error marking preferences as set:", error);
    throw new Error("Failed to mark preferences as set");
  }
}


