import { authClient } from "./auth-client";

// Types for GitHub API responses
interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  created_at: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

interface GitHubContribution {
  date: string;
  count: number;
}

interface GitHubContributionsResponse {
  totalContributions: number;
  contributions: GitHubContribution[];
}

export interface GitHubStats {
  // User basic info
  name: string;
  username: string;
  joinedDate: string;
  yearsOnGitHub: number;
  
  // Contribution stats
  totalContributions: number;
  activeWeeks: number;
  totalWeeks: number;
  longestStreak: number;
  averageWeeklyCommits: number;
  
  // Repository stats
  totalRepositories: number;
  totalStars: number;
  totalFollowers: number;
  topLanguage: string;
  
  // Repository details
  repositories: Array<{
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    html_url: string;
  }>;
}

/**
 * Fetches GitHub access token using better-auth
 */
async function getGitHubAccessToken(): Promise<string> {
  try {
    const result = await authClient.getAccessToken({
      providerId: "github"
    });
    
    if ('error' in result && result.error) {
      throw new Error(result.error.message || "Failed to get access token");
    }
    
    if (!result.data.accessToken) {
      throw new Error("No GitHub access token available. Please connect your GitHub account.");
    }
    
    return result.data.accessToken;
  } catch (error) {
    console.error("Error getting GitHub access token:", error);
    throw new Error("Failed to get GitHub access token. Please ensure you're logged in and have connected your GitHub account.");
  }
}

/**
 * Makes authenticated request to GitHub API
 */
async function makeGitHubRequest<T>(endpoint: string, accessToken: string): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Better-Hack-App'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

/**
 * Fetches user's contribution data from GitHub using GraphQL
 */
async function fetchUserContributions(accessToken: string, username: string): Promise<GitHubContributionsResponse> {
  // Use GitHub's GraphQL API to get contribution data
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Better-Hack-App'
    },
    body: JSON.stringify({
      query,
      variables: { username }
    })
  });

  if (!response.ok) {
    throw new Error(`GraphQL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  const contributions: GitHubContribution[] = [];
  const contributionCalendar = data.data.user.contributionsCollection.contributionCalendar;
  
  // Extract contribution data from the calendar
  contributionCalendar.weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      if (day.contributionCount > 0) {
        contributions.push({
          date: day.date,
          count: day.contributionCount
        });
      }
    });
  });

  contributions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    totalContributions: contributionCalendar.totalContributions,
    contributions
  };
}

/**
 * Calculates streak and activity statistics from contributions
 */
function calculateActivityStats(contributions: GitHubContribution[]): {
  activeWeeks: number;
  totalWeeks: number;
  longestStreak: number;
  averageWeeklyCommits: number;
} {
  if (contributions.length === 0) {
    return {
      activeWeeks: 0,
      totalWeeks: 0,
      longestStreak: 0,
      averageWeeklyCommits: 0
    };
  }

  // Sort contributions by date
  const sortedContributions = contributions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get the date range from the actual contributions
  const firstDate = new Date(sortedContributions[0].date);
  const lastDate = new Date(sortedContributions[sortedContributions.length - 1].date);
  
  // Calculate weeks from the actual contribution data
  const weeklyContributions = new Map<string, number>();
  
  // Group contributions by week (Sunday to Saturday)
  sortedContributions.forEach(contrib => {
    const date = new Date(contrib.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    weeklyContributions.set(weekKey, (weeklyContributions.get(weekKey) || 0) + contrib.count);
  });

  const weekEntries = Array.from(weeklyContributions.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const activeWeeks = weekEntries.filter(([, count]) => count > 0).length;
  const totalWeeks = weekEntries.length;
  
  // Calculate longest streak (consecutive days with contributions)
  let currentStreak = 0;
  let longestStreak = 0;
  
  // Create a map of all days with contributions
  const dailyContributions = new Map<string, number>();
  sortedContributions.forEach(contrib => {
    dailyContributions.set(contrib.date, contrib.count);
  });
  
  // Get all days in the range
  const allDays = [];
  const currentDate = new Date(firstDate);
  while (currentDate <= lastDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    allDays.push(dateKey);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate streak from daily contributions
  for (const day of allDays) {
    const count = dailyContributions.get(day) || 0;
    if (count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  // Calculate average weekly commits correctly
  const totalCommits = sortedContributions.reduce((sum, contrib) => sum + contrib.count, 0);
  const averageWeeklyCommits = activeWeeks > 0 ? Math.round(totalCommits / activeWeeks) : 0;
  
  return {
    activeWeeks,
    totalWeeks,
    longestStreak,
    averageWeeklyCommits
  };
}

/**
 * Fetches user's repositories and calculates language statistics
 */
async function fetchUserRepositories(accessToken: string, username: string): Promise<{
  repositories: Array<{
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    html_url: string;
  }>;
  totalStars: number;
  topLanguage: string;
}> {
  const repos = await makeGitHubRequest<GitHubRepository[]>(`/users/${username}/repos?sort=updated&per_page=100`, accessToken);
  
  const repositories = repos.map(repo => ({
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    html_url: `https://github.com/${repo.full_name}`
  }));
  
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  
  // Calculate top language
  const languageCount = new Map<string, number>();
  repos.forEach(repo => {
    if (repo.language) {
      languageCount.set(repo.language, (languageCount.get(repo.language) || 0) + 1);
    }
  });
  
  const topLanguage = languageCount.size > 0 
    ? Array.from(languageCount.entries()).sort((a, b) => b[1] - a[1])[0][0]
    : 'None';
  
  return {
    repositories,
    totalStars,
    topLanguage
  };
}

/**
 * Main function to fetch comprehensive GitHub statistics
 */
export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    // Get access token
    const accessToken = await getGitHubAccessToken();
    
    // Fetch user data
    const user = await makeGitHubRequest<GitHubUser>('/user', accessToken);
    
    // Fetch contributions data
    const contributionsData = await fetchUserContributions(accessToken, user.login);
    
    // Calculate activity stats
    const activityStats = calculateActivityStats(contributionsData.contributions);
    
    // Fetch repository data
    const repoData = await fetchUserRepositories(accessToken, user.login);
    
    // Calculate years on GitHub
    const joinedDate = new Date(user.created_at);
    const yearsOnGitHub = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    
    return {
      name: user.name || user.login,
      username: user.login,
      joinedDate: joinedDate.toISOString().split('T')[0],
      yearsOnGitHub,
      totalContributions: contributionsData.totalContributions,
      activeWeeks: activityStats.activeWeeks,
      totalWeeks: activityStats.totalWeeks,
      longestStreak: activityStats.longestStreak,
      averageWeeklyCommits: activityStats.averageWeeklyCommits,
      totalRepositories: user.public_repos,
      totalStars: repoData.totalStars,
      totalFollowers: user.followers,
      topLanguage: repoData.topLanguage,
      repositories: repoData.repositories
    };
    
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw new Error(`Failed to fetch GitHub statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to format GitHub stats for display
 */
export function formatGitHubStats(stats: GitHubStats): {
  name: string;
  totalContributions: number;
  activeWeeks: number;
  totalWeeks: number;
  longestStreak: number;
  averageWeeklyCommits: number;
  topLanguage: string;
  totalStars: number;
  totalFollowers: number;
} {
  return {
    name: stats.name,
    totalContributions: stats.totalContributions,
    activeWeeks: stats.activeWeeks,
    totalWeeks: stats.totalWeeks,
    longestStreak: stats.longestStreak,
    averageWeeklyCommits: stats.averageWeeklyCommits,
    topLanguage: stats.topLanguage,
    totalStars: stats.totalStars,
    totalFollowers: stats.totalFollowers
  };
}
