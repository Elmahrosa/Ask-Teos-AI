"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { usePiNetworkAuthentication } from "./use-pi-network-authentication"
import { useFounderStatus } from "./use-founder-status"
import { APP_CONFIG } from "@/lib/app-config"
import { llmService } from "@/lib/llm/service"
import { SearchMode, getSearchModeConfig } from "@/lib/search/types"

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
  const [searchMode, setSearchMode] = useState<SearchMode>("balanced") // Default to balanced
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

    try {
      // Convert messages to the format expected by LLM service
      const llmMessages = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }))

      // Add a system message to set the context
      const systemMessage = {
        role: "system",
        content: "You are ASK TEOS AI, a helpful assistant for the TEOS ecosystem. Provide accurate, concise answers about TEOS, blockchain, and related topics."
      }

      const allMessages = [systemMessage, ...llmMessages]
      const aiResponse = await llmService.generateResponse(allMessages, searchMode)
      const botMessage = createMessage(aiResponse, "ai")
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error generating AI response:', error)
      // Fallback to a simple error message
      const botMessage = createMessage("I apologize, but I'm experiencing technical difficulties. Please try again later.", "ai")
      setMessages((prev) => [...prev, botMessage])
    } finally {
      hideThinking()
      setIsLoading(false)
    }
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
    searchMode,

    // Actions
    sendMessage,
    handleKeyPress,
    handleInputChange,
    setSearchMode,
  }
}
