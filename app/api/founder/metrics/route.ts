import { NextResponse } from "next/server"

// GitHub repository details
const REPO_OWNER = "Elmahrosa"
const REPO_NAME = "Ask-Teos-AI"

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Ask-TEOS-AI",
    }

    // Add token if available for higher rate limits
    if (githubToken) {
      headers["Authorization"] = `Bearer ${githubToken}`
    }

    // Fetch repository data
    const repoResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
      { headers, next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }

    const repoData = await repoResponse.json()

    // Fetch contributors count
    const contributorsResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=1`,
      { headers, next: { revalidate: 300 } },
    )

    // Get contributor count from Link header
    const linkHeader = contributorsResponse.headers.get("Link")
    let contributorsCount = 0
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/)
      contributorsCount = match ? Number.parseInt(match[1]) : 1
    } else {
      const contributors = await contributorsResponse.json()
      contributorsCount = Array.isArray(contributors) ? contributors.length : 0
    }

    // Fetch pull requests
    const prsResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open`, {
      headers,
      next: { revalidate: 300 },
    })

    const pullRequests = await prsResponse.json()

    return NextResponse.json({
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      issues: repoData.open_issues_count || 0,
      watchers: repoData.watchers_count || 0,
      contributors: contributorsCount,
      openPullRequests: Array.isArray(pullRequests) ? pullRequests.length : 0,
    })
  } catch (error) {
    console.error("Error fetching GitHub metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
