"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { usePiNetworkAuthentication } from "./use-pi-network-authentication"
import { useFounderStatus } from "./use-founder-status"
import { APP_CONFIG } from "@/lib/app-config"
import { BACKEND_URLS } from "@/lib/system-config"
import { generateOfflineResponse } from "@/lib/offline-ai"

// Helper function to create messages
const createMessage = (text: Message["text"], sender: Message["sender"], id?: Message["id"]): Message => ({
  id: id || Date.now().toString(),
  text,
  sender,
  timestamp: new Date(),
})

export const useChatbot = () => {
  const { isAuthenticated, authMessage, piAccessToken } = usePiNetworkAuthentication()

  const { isFounderUser } = useFounderStatus(piAccessToken)

  const [messages, setMessages] = useState<Message[]>([createMessage(APP_CONFIG.WELCOME_MESSAGE, "ai", "1")])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const showThinking = () => {
    const thinkingMessage = createMessage("Thinking... (0)", "ai", "thinking")
    setMessages((prev) => [...prev, thinkingMessage])

    let seconds = 0
    thinkingTimerRef.current = setInterval(() => {
      seconds += 1
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === "thinking" ? { ...msg, text: `Thinking... (${seconds})` } : msg)),
      )
    }, 1000)
  }

  const hideThinking = () => {
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current)
      thinkingTimerRef.current = null
    }
    setMessages((prev) => prev.filter((msg) => msg.id !== "thinking"))
  }

  const sendMessage = async () => {
    if (!input.trim()) {
      return
    }

    const userMessage = createMessage(input.trim(), "user")
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    showThinking()

    // Use local TEOS AI - no backend required
    setTimeout(() => {
      hideThinking()
      const aiResponse = generateOfflineResponse(userMessage.text)
      const botMessage = createMessage(aiResponse, "ai")
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Cleanup function
  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current)
      }
    }
  }, [])

  return {
    // State
    messages,
    input,
    isLoading,
    isAuthenticated,
    authMessage,
    isFounderUser,
    offlineMode,

    // Actions
    sendMessage,
    handleKeyPress,
    handleInputChange,
  }
}
