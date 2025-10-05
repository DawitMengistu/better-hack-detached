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
 * Creates a profile record for a user during onboarding
 */
export async function createProfileRecord(data: ProfileData, userId: string) {
  try {
    const { name, ...profileData } = data;

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

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


