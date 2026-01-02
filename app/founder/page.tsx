"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePiNetworkAuthentication } from "@/hooks/use-pi-network-authentication"
import { useFounderStatus } from "@/hooks/use-founder-status"
import { Activity, GitBranch, GitFork, GitPullRequest, Star, Users, TrendingUp, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { COLORS } from "@/lib/app-config"

interface GitHubMetrics {
  stars: number
  forks: number
  issues: number
  contributors: number
  watchers: number
  openPullRequests: number
}

export default function FounderDashboard() {
  const { isAuthenticated, piAccessToken } = usePiNetworkAuthentication()
  const { isFounderUser, userId } = useFounderStatus(piAccessToken)
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && isFounderUser) {
      fetchMetrics()
    }
  }, [isAuthenticated, isFounderUser])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      // Fetch from API route that handles GitHub API calls
      const response = await fetch("/api/founder/metrics")

      if (!response.ok) {
        throw new Error("Failed to fetch metrics")
      }

      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error fetching metrics:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please authenticate with Pi Network</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!isFounderUser) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This dashboard is only accessible to founders.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Your User ID: {userId || "Unknown"}</p>
            <Link href="/">
              <Button className="w-full" style={{ backgroundColor: COLORS.PRIMARY }}>
                Return to Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.PRIMARY }}>
              Founder Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, {userId}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Unlimited Access
            </Badge>
            <Link href="/">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Go to Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Ask-TEOS-AI - Solana TS Launchpad Chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Repository</p>
                <a
                  href="https://github.com/Elmahrosa/Ask-Teos-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.PRIMARY }}
                >
                  github.com/Elmahrosa/Ask-Teos-AI
                </a>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant="outline" className="mt-1">
                  Production Ready
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="GitHub Stars"
            value={metrics?.stars}
            icon={<Star className="w-5 h-5" />}
            loading={loading}
            error={error}
            color={COLORS.PRIMARY}
          />
          <MetricCard
            title="Forks"
            value={metrics?.forks}
            icon={<GitFork className="w-5 h-5" />}
            loading={loading}
            error={error}
            color={COLORS.PRIMARY}
          />
          <MetricCard
            title="Open Issues"
            value={metrics?.issues}
            icon={<GitBranch className="w-5 h-5" />}
            loading={loading}
            error={error}
            color={COLORS.PRIMARY}
          />
          <MetricCard
            title="Contributors"
            value={metrics?.contributors}
            icon={<Users className="w-5 h-5" />}
            loading={loading}
            error={error}
            color={COLORS.PRIMARY}
          />
          <MetricCard
            title="Watchers"
            value={metrics?.watchers}
            icon={<TrendingUp className="w-5 h-5" />}
            loading={loading}
            error={error}
            color={COLORS.PRIMARY}
          />
          <MetricCard
            title="Pull Requests"
            value={metrics?.openPullRequests}
            icon={<GitPullRequest className="w-5 h-5" />}
            loading={loading}
            error={error}
            color={COLORS.PRIMARY}
          />
        </div>

        {/* Features Status */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Status</CardTitle>
            <CardDescription>Current implementation status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <FeatureStatus name="Founder Authentication" status="active" />
              <FeatureStatus name="Unlimited Messaging" status="active" />
              <FeatureStatus name="GitHub Metrics API" status="active" />
              <FeatureStatus name="Tavily Deep Search" status="pending" description="Requires TAVILY_API_KEY" />
              <FeatureStatus name="PostHog Analytics" status="pending" description="Requires POSTHOG_KEY" />
              <FeatureStatus name="Solana RPC Integration" status="pending" description="Requires TEOS_RPC" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => window.open("https://github.com/Elmahrosa/Ask-Teos-AI", "_blank")}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                View Repository
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={fetchMetrics} disabled={loading}>
                <Activity className="w-4 h-4 mr-2" />
                Refresh Metrics
              </Button>
              <Link href="/" className="w-full">
                <Button className="w-full" style={{ backgroundColor: COLORS.PRIMARY }}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Test Chatbot
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  loading,
  error,
  color,
}: {
  title: string
  value?: number
  icon: React.ReactNode
  loading: boolean
  error: string | null
  color: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div style={{ color }}>{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-2xl font-bold text-muted-foreground">...</div>
        ) : error ? (
          <div className="text-sm text-destructive">Error</div>
        ) : (
          <div className="text-2xl font-bold">{value?.toLocaleString() ?? "N/A"}</div>
        )}
      </CardContent>
    </Card>
  )
}

function FeatureStatus({
  name,
  status,
  description,
}: {
  name: string
  status: "active" | "pending" | "error"
  description?: string
}) {
  const statusColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    error: "bg-red-500",
  }

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div>
        <p className="font-medium">{name}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Badge variant="outline" className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        {status}
      </Badge>
    </div>
  )
}
