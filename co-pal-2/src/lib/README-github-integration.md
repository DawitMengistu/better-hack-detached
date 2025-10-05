# GitHub Integration Documentation

This document explains how to use the GitHub data fetching functionality in the Better Hack application.

## Overview

The GitHub integration allows you to fetch comprehensive statistics about a user's GitHub activity using their access token from better-auth. The integration provides data similar to what you'd see on a GitHub profile, including contribution statistics, repository information, and activity metrics.

## Files Created

### Core Files
- `src/lib/github-data.ts` - Main GitHub data fetching functions
- `src/hooks/use-github-stats.ts` - React hook for easy integration
- `src/components/github/github-stats-display.tsx` - React component for displaying stats
- `src/lib/github-example.ts` - Usage examples
- `src/app/api/github/stats/route.ts` - API endpoint for fetching stats

## Usage

### 1. Basic Function Usage

```typescript
import { fetchGitHubStats, formatGitHubStats } from '@/lib/github-data';

// Fetch comprehensive GitHub statistics
const stats = await fetchGitHubStats();

// Format for display
const formattedStats = formatGitHubStats(stats);

console.log(formattedStats);
// Output:
// {
//   name: "Brook Solomon",
//   joined: "5 years ago",
//   totalContributions: 1423,
//   activeWeeks: "48 / 52",
//   longestStreak: "27 days",
//   averageWeeklyCommits: 31,
//   topLanguage: "TypeScript",
//   totalStars: 240,
//   totalFollowers: 180
// }
```

### 2. Using the React Hook

```tsx
import { useGitHubStats } from '@/hooks/use-github-stats';

function MyComponent() {
  const { stats, formattedStats, loading, error, refetch } = useGitHubStats();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data</div>;

  return (
    <div>
      <h1>{formattedStats.name}</h1>
      <p>Total Contributions: {formattedStats.totalContributions}</p>
      <p>Top Language: {formattedStats.topLanguage}</p>
      {/* ... more stats */}
    </div>
  );
}
```

### 3. Using the Display Component

```tsx
import { GitHubStatsDisplay } from '@/components/github/github-stats-display';

function ProfilePage() {
  return (
    <div>
      <h1>My GitHub Stats</h1>
      <GitHubStatsDisplay />
    </div>
  );
}
```

### 4. API Endpoint Usage

```typescript
// Fetch from API endpoint
const response = await fetch('/api/github/stats');
const data = await response.json();

if (data.success) {
  console.log('Raw stats:', data.data.raw);
  console.log('Formatted stats:', data.data.formatted);
} else {
  console.error('Error:', data.error);
}
```

## Data Structure

### Raw Stats (`GitHubStats`)
```typescript
interface GitHubStats {
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
    description: string | null;
    language: string | null;
    stargazers_count: number;
  }>;
}
```

### Formatted Stats
```typescript
interface FormattedStats {
  name: string;
  joined: string; // "5 years ago"
  totalContributions: number;
  activeWeeks: string; // "48 / 52"
  longestStreak: string; // "27 days"
  averageWeeklyCommits: number;
  topLanguage: string;
  totalStars: number;
  totalFollowers: number;
}
```

## Authentication Requirements

The function uses better-auth to get the GitHub access token. The user must:

1. Be logged in to the application
2. Have connected their GitHub account through better-auth
3. Have the necessary GitHub scopes (already configured in `src/utils/auth.ts`)

## Error Handling

The function includes comprehensive error handling:

- **No access token**: User needs to connect GitHub account
- **API errors**: GitHub API rate limits or authentication issues
- **Network errors**: Connection problems
- **Data parsing errors**: Invalid response format

## GitHub API Scopes Required

The following scopes are already configured in the better-auth setup:

- `user` - Read user profile data
- `user:email` - Read user email
- `repo` - Read repository data
- `read:org` - Read organization data
- `read:user` - Read user data
- `user:follow` - Read followers/following

## Rate Limiting

GitHub API has rate limits:
- Authenticated requests: 5,000 requests per hour
- The function makes multiple API calls, so be mindful of usage

## Example Output

When you run the function, you'll get output similar to:

```
GitHub Stats for "Brook Solomon"

Category                    Value
Joined                      5 years ago
Total Contributions         1,423
Active Weeks               48 / 52
Longest Streak             27 days
Average Weekly Commits      31
Top Language                TypeScript
Total Stars                 240
Total Followers            180

Top Repositories:
1. awesome-project (45 stars) - TypeScript
   A really cool project description
2. another-repo (32 stars) - JavaScript
   Another project description
...
```

## Integration with Existing Code

The GitHub integration is designed to work seamlessly with the existing better-auth setup. No additional configuration is required beyond what's already in place.

## Testing

To test the integration:

1. Ensure you're logged in with a GitHub-connected account
2. Use the React hook or component in a page
3. Check the browser console for any errors
4. Verify the data matches your actual GitHub profile

## Troubleshooting

### Common Issues

1. **"No GitHub access token available"**
   - User needs to connect their GitHub account
   - Check if better-auth is properly configured

2. **"GitHub API error: 401"**
   - Access token is invalid or expired
   - User needs to re-authenticate

3. **"GitHub API error: 403"**
   - Rate limit exceeded
   - Wait before making more requests

4. **Empty or missing data**
   - User might not have public repositories
   - Check GitHub privacy settings

### Debug Mode

To debug issues, check the browser console for detailed error messages. The function logs all API requests and responses in development mode.
