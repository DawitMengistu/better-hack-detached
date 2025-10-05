"use client";

import { useGitHubStats } from '@/hooks/use-github-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Github, Star, Users, Calendar, TrendingUp } from 'lucide-react';

export function GitHubStatsDisplay() {
  const { stats, formattedStats, loading, error, refetch } = useGitHubStats();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading GitHub stats...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-red-500">
              <Github className="w-6 h-6 mx-auto mb-1" />
              <p className="font-medium text-sm">Failed to load GitHub stats</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || !formattedStats) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center">
            <Github className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">No GitHub data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          <CardTitle className="text-base font-semibold truncate max-w-[120px]">{formattedStats.name}</CardTitle>
          <span className="text-xs text-muted-foreground truncate max-w-[80px]">@{stats.username}</span>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="px-2 py-1 text-xs">
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="grid grid-cols-2 gap-2">
          {/* Joined date not available in formattedStats, so this block is removed */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Followers</span>
            <span className="text-xs font-medium">{formattedStats.totalFollowers}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Repos</span>
            <span className="text-xs font-medium">{stats.totalRepositories}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Stars</span>
            <span className="text-xs font-medium">{formattedStats.totalStars.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Top Lang</span>
            <Badge variant="secondary" className="text-xs truncate max-w-[60px]">{formattedStats.topLanguage}</Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Contribs</span>
            <span className="text-xs font-medium">{formattedStats.totalContributions.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs font-semibold">Top Repositories</span>
          <div className="max-h-40 overflow-y-auto mt-1 space-y-2">
            {stats.repositories
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 5)
              .map((repo) => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs truncate max-w-[100px]">{repo.name}</h4>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[120px] mt-0.5">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-0.5">
                      {repo.language && (
                        <Badge variant="outline" className="text-xs truncate max-w-[60px]">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
