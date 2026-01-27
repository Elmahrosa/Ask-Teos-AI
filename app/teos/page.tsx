"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TEOS_FOUNDER,
  TEOS_VISION,
  TEOS_CORE_REPOS,
  TEOS_DAPPS,
  TEOS_ALL_REPOS,
  TEOS_TECH_STACK,
} from "@/lib/teos-ecosystem"

export default function TeosInfoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">TEOS Ecosystem</h1>
        <p className="text-muted-foreground">Egypt's Sovereign Blockchain Gateway</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Founder</CardTitle>
          <CardDescription>Leading Egypt's blockchain revolution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Name:</strong> {TEOS_FOUNDER.name}
          </div>
          <div>
            <strong>Role:</strong> {TEOS_FOUNDER.role}
          </div>
          <div>
            <strong>Organization:</strong> {TEOS_FOUNDER.organization}
          </div>
          <div>
            <strong>GitHub:</strong>{" "}
            <a
              href={`https://${TEOS_FOUNDER.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {TEOS_FOUNDER.github}
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vision & Mission</CardTitle>
          <CardDescription>Building digital sovereignty for Egypt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <strong>Mission:</strong>
            <p className="mt-1">{TEOS_VISION.mission}</p>
          </div>
          <div>
            <strong>Alignment:</strong>
            <div className="flex gap-2 mt-1">
              {TEOS_VISION.alignment.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <strong>Goal:</strong>
            <p className="mt-1">{TEOS_VISION.goal}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
          <CardDescription>Modern architecture powering TEOS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <strong>Frontend:</strong> {TEOS_TECH_STACK.frontend}
            </div>
            <div>
              <strong>Backend:</strong> {TEOS_TECH_STACK.backend}
            </div>
            <div>
              <strong>Blockchain:</strong> {TEOS_TECH_STACK.blockchain}
            </div>
            <div>
              <strong>AI:</strong> {TEOS_TECH_STACK.ai}
            </div>
            <div>
              <strong>Search:</strong> {TEOS_TECH_STACK.search}
            </div>
            <div>
              <strong>Analytics:</strong> {TEOS_TECH_STACK.analytics}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Repositories ({TEOS_CORE_REPOS.length})</CardTitle>
          <CardDescription>Essential TEOS infrastructure projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TEOS_CORE_REPOS.map((repo) => (
              <div key={repo.name} className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2">
                  <strong>{repo.name}</strong>
                  <Badge variant="outline">{repo.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>DApps Ecosystem</CardTitle>
          <CardDescription>Applications built on TEOS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TEOS_DAPPS.map((dapp) => (
              <div key={dapp} className="p-3 bg-secondary rounded-lg">
                {dapp}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Repositories</CardTitle>
          <CardDescription>Complete ecosystem of {TEOS_ALL_REPOS.total} repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(TEOS_ALL_REPOS.categories).map(([category, repos]) => (
              <div key={category}>
                <h3 className="font-semibold capitalize mb-2">
                  {category} ({repos.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {repos.map((repo) => (
                    <Badge key={repo} variant="secondary">
                      {repo}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
