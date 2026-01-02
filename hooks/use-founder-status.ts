"use client"

import { useState, useEffect } from "react"
import { isFounder, getUserIdFromToken } from "@/lib/founder-auth"

export function useFounderStatus(piAccessToken: string | null) {
  const [isFounderUser, setIsFounderUser] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!piAccessToken) {
      setIsFounderUser(false)
      setUserId(null)
      return
    }

    const extractedUserId = getUserIdFromToken(piAccessToken)
    setUserId(extractedUserId)

    if (extractedUserId) {
      const founderStatus = isFounder(extractedUserId)
      setIsFounderUser(founderStatus)
      console.log("[v0] Founder status:", founderStatus, "User ID:", extractedUserId)
    }
  }, [piAccessToken])

  return { isFounderUser, userId }
}
