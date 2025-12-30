"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { usePiNetworkAuthentication } from "@/hooks/use-pi-network-authentication"
import { COLORS, APP_CONFIG } from "@/lib/app-config"
import { Settings, Lock, Unlock, User, MessageSquare } from "lucide-react"

interface DashboardSettings {
  founderUsername: string
  dailyMessageLimit: number
  isUnlocked: boolean
}

export default function Dashboard() {
  const { isAuthenticated, authMessage, piAccessToken } = usePiNetworkAuthentication()
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [settings, setSettings] = useState<DashboardSettings>({
    founderUsername: "",
    dailyMessageLimit: 10,
    isUnlocked: false,
  })
  const [newLimit, setNewLimit] = useState("10")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Get current Pi user info
  useEffect(() => {
    const getUserInfo = async () => {
      if (isAuthenticated && piAccessToken) {
        try {
          // Decode the JWT token to get user info (basic decode, not verifying signature)
          const payload = piAccessToken.split(".")[1]
          const decoded = JSON.parse(atob(payload))
          setCurrentUser(decoded.username || decoded.user?.username || "Unknown")

          // Load saved settings from localStorage
          const savedSettings = localStorage.getItem("dashboard_settings")
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings)
            setSettings(parsed)
            setNewLimit(parsed.dailyMessageLimit.toString())
          } else {
            // Initialize with current user as founder
            setSettings((prev) => ({ ...prev, founderUsername: decoded.username || "" }))
          }
        } catch (error) {
          console.error("Error getting user info:", error)
        }
      }
    }
    getUserInfo()
  }, [isAuthenticated, piAccessToken])

  const isFounder = currentUser === settings.founderUsername || !settings.founderUsername

  const handleUnlock = () => {
    if (!isFounder) {
      setMessage("Only the founder can unlock the chatbot!")
      return
    }

    const newSettings = { ...settings, isUnlocked: true }
    setSettings(newSettings)
    localStorage.setItem("dashboard_settings", JSON.stringify(newSettings))
    setMessage("✓ Chatbot unlocked successfully!")
  }

  const handleLock = () => {
    if (!isFounder) {
      setMessage("Only the founder can lock the chatbot!")
      return
    }

    const newSettings = { ...settings, isUnlocked: false }
    setSettings(newSettings)
    localStorage.setItem("dashboard_settings", JSON.stringify(newSettings))
    setMessage("✓ Chatbot locked successfully!")
  }

  const handleUpdateLimit = () => {
    if (!isFounder) {
      setMessage("Only the founder can update settings!")
      return
    }

    const limit = Number.parseInt(newLimit)
    if (isNaN(limit) || limit < 1) {
      setMessage("Please enter a valid number (minimum 1)")
      return
    }

    const newSettings = { ...settings, dailyMessageLimit: limit }
    setSettings(newSettings)
    localStorage.setItem("dashboard_settings", JSON.stringify(newSettings))
    setMessage(`✓ Daily message limit updated to ${limit}!`)
  }

  const handleSetFounder = () => {
    if (settings.founderUsername && settings.founderUsername !== currentUser) {
      setMessage("A founder is already set. Contact support to change it.")
      return
    }

    const newSettings = { ...settings, founderUsername: currentUser || "" }
    setSettings(newSettings)
    localStorage.setItem("dashboard_settings", JSON.stringify(newSettings))
    setMessage("✓ You are now set as the founder!")
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold mb-4">{APP_CONFIG.NAME} - Dashboard</div>
        <div className="text-lg mb-4">{authMessage}</div>
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderBottomColor: COLORS.PRIMARY }}
        ></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Settings className="w-6 h-6" style={{ color: COLORS.PRIMARY }} />
              Founder Dashboard
            </CardTitle>
            <CardDescription>Manage your {APP_CONFIG.NAME} chatbot settings</CardDescription>
          </CardHeader>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pi Username:</span>
              <Badge variant="secondary" className="text-base font-mono">
                {currentUser || "Loading..."}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role:</span>
              <Badge style={{ backgroundColor: isFounder ? COLORS.PRIMARY : "#6b7280", color: "white" }}>
                {isFounder ? "Founder" : "User"}
              </Badge>
            </div>
            {!settings.founderUsername && currentUser && (
              <Button onClick={handleSetFounder} className="w-full" style={{ backgroundColor: COLORS.PRIMARY }}>
                Set Me as Founder
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Chatbot Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chatbot Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {settings.isUnlocked ? (
                  <Unlock className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{settings.isUnlocked ? "Unlocked" : "Locked"}</span>
              </div>
              <Badge
                variant={settings.isUnlocked ? "default" : "secondary"}
                className="text-sm"
                style={settings.isUnlocked ? { backgroundColor: "#10b981", color: "white" } : {}}
              >
                {settings.isUnlocked ? "Active" : "Restricted"}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUnlock}
                disabled={settings.isUnlocked || !isFounder}
                className="flex-1"
                style={{ backgroundColor: settings.isUnlocked ? "#9ca3af" : COLORS.PRIMARY }}
              >
                <Unlock className="w-4 h-4 mr-2" />
                Unlock
              </Button>
              <Button
                onClick={handleLock}
                disabled={!settings.isUnlocked || !isFounder}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Lock className="w-4 h-4 mr-2" />
                Lock
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Limit Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Message Limit</CardTitle>
            <CardDescription>Set the number of free messages users can send per day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Current Limit:</span>
              <Badge variant="secondary" className="text-lg">
                {settings.dailyMessageLimit} messages/day
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">New Daily Limit</Label>
              <div className="flex gap-2">
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  disabled={!isFounder}
                  placeholder="Enter new limit"
                />
                <Button onClick={handleUpdateLimit} disabled={!isFounder} style={{ backgroundColor: COLORS.PRIMARY }}>
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Founder Info */}
        {settings.founderUsername && (
          <Card>
            <CardHeader>
              <CardTitle>Founder Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Founder Username:</span>
                <Badge variant="outline" className="text-base font-mono">
                  {settings.founderUsername}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message Display */}
        {message && (
          <Card className={message.startsWith("✓") ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <CardContent className="pt-6">
              <p className={message.startsWith("✓") ? "text-green-700" : "text-red-700"}>{message}</p>
            </CardContent>
          </Card>
        )}

        {/* Back to Chat */}
        <Button onClick={() => (window.location.href = "/")} variant="outline" className="w-full">
          Back to Chat
        </Button>
      </div>
    </div>
  )
}
