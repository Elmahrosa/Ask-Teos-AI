"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, User, Bot, Crown } from "lucide-react"
import { useChatbot } from "@/hooks/use-chatbot"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import Link from "next/link"
import { useState } from "react"

export default function ChatBot() {
  const [showWelcome, setShowWelcome] = useState(true)
  const {
    messages,
    input,
    isLoading,
    isAuthenticated,
    authMessage,
    isFounderUser,
    offlineMode,
    sendMessage,
    handleKeyPress,
    handleInputChange,
    searchMode,
    setSearchMode,
    restrictToOfficialSources,
    setRestrictToOfficialSources,
  } = useChatbot()

  const { bottomRef } = useScrollToBottom([messages])

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-4">
        <div className="text-xl font-semibold mb-4">{APP_CONFIG.NAME}</div>
        <div className="text-lg mb-4">{authMessage}</div>
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderBottomColor: COLORS.PRIMARY }}
        ></div>
      </div>
    )
  }

  if (showWelcome && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.BACKGROUND }}>
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-white text-center py-8" style={{ backgroundColor: COLORS.PRIMARY }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Bot className="w-10 h-10" />
              <CardTitle className="text-3xl font-bold">{APP_CONFIG.NAME}</CardTitle>
              {isFounderUser && (
                <Badge variant="secondary" className="bg-yellow-500 text-white border-yellow-600">
                  <Crown className="w-4 h-4 mr-1" />
                  Founder
                </Badge>
              )}
            </div>
            <p className="text-lg opacity-95">{APP_CONFIG.DESCRIPTION}</p>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Unlock the Future of Decentralized Interaction</h2>
              <p className="text-gray-700 leading-relaxed">
                Seamlessly integrate Pi Network&apos;s blockchain with intelligent AI-driven chat, giving you a secure,
                private, and lightning-fast experience. With Pi AI, founders and pioneers can explore real-time
                insights, manage your Pi assets, and connect with the Pi community effortlessly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50">
                <div className="w-8 h-8 mb-2" style={{ color: COLORS.PRIMARY }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-shield"
                  >
                    <path d="M12 2L2 22h20L12 2z"></path>
                    <polyline points="2 14 12 22 22 14"></polyline>
                    <line x1="12" y1="14" x2="12" y2="2"></line>
                    <line x1="12" y1="26" x2="12" y2="22"></line>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600">Protected on Pi Network blockchain</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50">
                <div className="w-8 h-8 mb-2" style={{ color: COLORS.PRIMARY }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-zap"
                  >
                    <polygon points="13 2 3 14 12 26 21 14 13 2"></polygon>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Real-time AI responses</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50">
                <div className="w-8 h-8 mb-2" style={{ color: COLORS.PRIMARY }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-globe"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10z"></path>
                    <circle cx="12" cy="12" r="1"></circle>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">TEOS Ecosystem</h3>
                <p className="text-sm text-gray-600">43 repos of blockchain knowledge</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                Built for simplicity, every message, query, or transaction is protected on the Pi Network, combining the
                power of blockchain with smart AI assistance. Whether you&apos;re tracking your Pi balance, exploring dApps,
                or experimenting with AI integrations, Pi AI makes it intuitive and reliable.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-700">
                  TEOS AI Ready - Powered by Local Knowledge Base
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={() => setShowWelcome(false)}
                className="w-full py-6 text-lg font-semibold hover:opacity-90"
                style={{ backgroundColor: COLORS.PRIMARY }}
              >
                Start Chatting with TEOS AI
              </Button>

              <div className="flex gap-2">
                <Link href="/teos" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Explore Ecosystem
                  </Button>
                </Link>
                {isFounderUser && (
                  <Link href="/founder" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Crown className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {isFounderUser && (
              <div className="text-center">
                <Badge variant="outline" className="text-sm py-2 px-4">
                  Unlimited Messages Available
                </Badge>
              </div>
            )}

            <p className="text-center text-sm text-gray-600 pt-4">
              Join the next generation of digital pioneers. Safe, decentralized, and ready for the future.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <Card className="w-full max-w-md h-[600px] flex flex-col shadow-xl">
        <CardHeader className="text-white rounded-t-lg" style={{ backgroundColor: COLORS.PRIMARY }}>
          <CardTitle className="text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="text-xl font-semibold">{APP_CONFIG.NAME}</div>
              {isFounderUser && (
                <Badge variant="secondary" className="bg-yellow-500 text-white border-yellow-600">
                  <Crown className="w-3 h-3 mr-1" />
                  Founder
                </Badge>
              )}
            </div>
            {APP_CONFIG.DESCRIPTION && <div className="text-sm opacity-90 mt-1">{APP_CONFIG.DESCRIPTION}</div>}
            {isFounderUser && (
              <div className="flex gap-2 mt-3">
                <Link href="/founder" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full text-xs bg-white/20 hover:bg-white/30">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/teos" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full text-xs bg-white/20 hover:bg-white/30">
                    Ecosystem
                  </Button>
                </Link>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  message.sender === "user" ? "bg-gray-600" : ""
                }`}
                style={message.sender === "user" ? { backgroundColor: "#4b5563" } : { backgroundColor: COLORS.PRIMARY }}
              >
                {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "text-white"
                    : message.id === "thinking"
                      ? "bg-gray-100 text-gray-600 italic"
                      : "bg-gray-100 text-gray-800"
                }`}
                style={message.sender === "user" ? { backgroundColor: COLORS.PRIMARY } : {}}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>

        <CardFooter className="p-4 border-t">
          {isFounderUser && (
            <div className="w-full mb-2">
              <Badge variant="outline" className="w-full justify-center text-xs py-1">
                Unlimited Messages Available
              </Badge>
            </div>
          )}
          <div className="flex w-full flex-col mb-4 gap-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium">Restrict to TEOS / Elmahrosa sources:</span>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={restrictToOfficialSources}
                  onChange={(e) => setRestrictToOfficialSources(e.target.checked)}
                  className="h-4 w-4 text-primary rounded"
                />
                <span className="text-xs">{restrictToOfficialSources ? "ON" : "OFF"}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium">Search Mode:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSearchMode("fast")}
                  className={`px-2 py-1 rounded text-xs ${searchMode === "fast" ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  Fast
                </button>
                <button
                  onClick={() => setSearchMode("balanced")}
                  className={`px-2 py-1 rounded text-xs ${searchMode === "balanced" ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  Balanced
                </button>
                <button
                  onClick={() => setSearchMode("deep")}
                  className={`px-2 py-1 rounded text-xs ${searchMode === "deep" ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  Deep
                </button>
                <span className="text-xs text-gray-500">({searchMode})</span>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border-2"
              style={
                {
                  borderColor: "#e5e7eb",
                }
              }
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{ backgroundColor: COLORS.PRIMARY }}
              size="icon"
            >
              <Send size={16} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
