"use server";


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createProfileRecord(data: any, userId: string) {
  const { name, ...profileData } = data;

  if (name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  const profile = await prisma.profile.create({
    data: {
      age: profileData.age,
      gender: profileData.gender,
      timeCommitment: profileData.timeCommitment,
      techStack: profileData.techStack,
      country: profileData.country,
      occupation: profileData.occupation,
      openForProjects: profileData.openForProjects,
      user: { connect: { id: userId } },
    },
  });

  return profile;
}
