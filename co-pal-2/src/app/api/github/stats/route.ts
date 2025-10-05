import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubStats, formatGitHubStats } from '@/lib/github-data';

export async function GET(request: NextRequest) {
  try {
    // Fetch GitHub statistics
    const stats = await fetchGitHubStats();
    const formattedStats = formatGitHubStats(stats);
    
    return NextResponse.json({
      success: true,
      data: {
        raw: stats,
        formatted: formattedStats
      }
    });
    
  } catch (error) {
    console.error('GitHub stats API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub statistics'
    }, { status: 500 });
  }
}
