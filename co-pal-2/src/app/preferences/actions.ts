"use server"

import { PreferencesFormData } from "@/lib/schemas/preferences"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function savePreferences(userId: string, data: PreferencesFormData) {
  try {
    // Upsert ensures existing preferences are updated
    const preferences = await prisma.preferences.upsert({
      where: { userId },
      update: {
        preferredGenders: data.preferredGenders,
        ageRange: data.ageRange,
        timeCommitment: data.timeCommitment,
        techStack: data.techStack,
        countryPreferences: data.countryPreferences,
        occupations: data.occupations,
      },
      create: {
        userId,
        preferredGenders: data.preferredGenders,
        ageRange: data.ageRange,
        timeCommitment: data.timeCommitment,
        techStack: data.techStack,
        countryPreferences: data.countryPreferences,
        occupations: data.occupations,
      },
    })
    return preferences
  } catch (err) {
    console.error("Failed to save preferences:", err)
    throw err
  }
}
