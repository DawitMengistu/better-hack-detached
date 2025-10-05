/**
 * Example usage of the GitHub data fetching function
 * This file demonstrates how to use the fetchGitHubStats function
 */

import { fetchGitHubStats, formatGitHubStats } from './github-data';

/**
 * Example function showing how to fetch and display GitHub stats
 */
export async function exampleGitHubUsage() {
  try {
    console.log('Fetching GitHub stats...');
    
    // Fetch the comprehensive GitHub statistics
    const stats = await fetchGitHubStats();
    
    console.log('Raw GitHub stats:', stats);
    
    // Format the stats for display
    const formattedStats = formatGitHubStats(stats);
    
    console.log('Formatted stats:', formattedStats);
    
    // Display the stats in a format similar to your example
    console.log(`
GitHub Stats for "${formattedStats.name}"

Category                    Value
Joined                      ${formattedStats.joined}
Total Contributions         ${formattedStats.totalContributions.toLocaleString()}
Active Weeks               ${formattedStats.activeWeeks}
Longest Streak             ${formattedStats.longestStreak}
Average Weekly Commits     ${formattedStats.averageWeeklyCommits}
Top Language               ${formattedStats.topLanguage}
Total Stars                ${formattedStats.totalStars.toLocaleString()}
Total Followers            ${formattedStats.totalFollowers.toLocaleString()}
    `);
    
    // Display top repositories
    if (stats.repositories.length > 0) {
      console.log('\nTop Repositories:');
      stats.repositories
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .forEach((repo, index) => {
          console.log(`${index + 1}. ${repo.name} (${repo.stargazers_count} stars) - ${repo.language || 'No language'}`);
          if (repo.description) {
            console.log(`   ${repo.description}`);
          }
        });
    }
    
    return { stats, formattedStats };
    
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}

/**
 * Example of how to use this in a Next.js API route
 */
export async function getGitHubStatsAPI() {
  try {
    const stats = await fetchGitHubStats();
    const formattedStats = formatGitHubStats(stats);
    
    return {
      success: true,
      data: {
        raw: stats,
        formatted: formattedStats
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
