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
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading GitHub stats...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-red-500">
              <Github className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Failed to load GitHub stats</p>
              <p className="text-sm text-muted-foreground">{error}</p>
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
        <CardContent className="p-6">
          <div className="text-center">
            <Github className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No GitHub data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Github className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl">{formattedStats.name}</CardTitle>
                <p className="text-sm text-muted-foreground">@{stats.username}</p>
              </div>
            </div>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Joined</span>
              <span className="text-sm font-medium">{formattedStats.joined}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Followers</span>
              <span className="text-sm font-medium">{formattedStats.totalFollowers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Repositories</span>
              <span className="text-sm font-medium">{stats.totalRepositories}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contributions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Contributions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total (past year)</span>
              <span className="text-sm font-medium">{formattedStats.totalContributions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Weeks</span>
              <span className="text-sm font-medium">{formattedStats.activeWeeks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Longest Streak</span>
              <span className="text-sm font-medium">{formattedStats.longestStreak}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Weekly</span>
              <span className="text-sm font-medium">{formattedStats.averageWeeklyCommits}</span>
            </div>
          </CardContent>
        </Card>

        {/* Languages & Stars */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Languages & Stars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Top Language</span>
              <Badge variant="secondary">{formattedStats.topLanguage}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Stars</span>
              <span className="text-sm font-medium">{formattedStats.totalStars.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Repositories */}
      {stats.repositories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.repositories
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5)
                .map((repo, index) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{repo.name}</h4>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        {repo.language && (
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
