import { useEffect, useState } from "react"
// import { getIntegrationStatus } from "@/lib/check-integrations"

type IntegrationStatus = { github: boolean; linkedin: boolean; wakatime: boolean }

export function useIntegrationStatus(userId: string) {
  const [status, setStatus] = useState<IntegrationStatus>({ github: false, linkedin: false, wakatime: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/integration-status?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((result) => setStatus({
        github: !!result.github,
        linkedin: !!result.linkedin,
        wakatime: !!result.wakatime,
      }))
      .finally(() => setLoading(false));
  }, [userId]);

  return { status, loading };
}
