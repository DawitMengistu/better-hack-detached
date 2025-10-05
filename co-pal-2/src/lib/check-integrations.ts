import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getIntegrationStatus(userId: string) {
  // providerIds: github, linkedin, wakatime
  const providers = ['github', 'linkedin', 'wakatime']
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      providerId: { in: providers },
    },
    select: { providerId: true },
  })
  const status: Record<string, boolean> = {
    github: false,
    linkedin: false,
    wakatime: false,
  }
  for (const acc of accounts) {
    if (providers.includes(acc.providerId)) {
      status[acc.providerId] = true
    }
  }
  return status
}

// Usage:
// const status = await getIntegrationStatus(userId)
// status.github === true if linked
