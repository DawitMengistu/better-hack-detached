"use client";

import { useState, useEffect } from 'react';
import { fetchGitHubStats, formatGitHubStats, GitHubStats } from '@/lib/github-data';

interface UseGitHubStatsReturn {
  stats: GitHubStats | null;
  formattedStats: ReturnType<typeof formatGitHubStats> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching and managing GitHub statistics
 */
export function useGitHubStats(): UseGitHubStatsReturn {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchGitHubStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub stats';
      setError(errorMessage);
      console.error('GitHub stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formattedStats = stats ? formatGitHubStats(stats) : null;

  return {
    stats,
    formattedStats,
    loading,
    error,
    refetch: fetchStats
  };
}
