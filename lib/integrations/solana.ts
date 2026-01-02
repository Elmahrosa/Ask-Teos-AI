/**
 * Solana TEOS RPC Integration
 *
 * This module provides integration with the TEOS Solana testnet.
 * Configure TEOS_RPC environment variable with your RPC endpoint.
 */

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

/**
 * Get Solana connection to TEOS network
 */
export function getTeosConnection(): Connection {
  const rpcUrl = process.env.TEOS_RPC || process.env.NEXT_PUBLIC_TEOS_RPC

  if (!rpcUrl) {
    console.warn("TEOS_RPC not configured. Using Solana devnet. Set TEOS_RPC for production.")
    return new Connection(clusterApiUrl("devnet"), "confirmed")
  }

  return new Connection(rpcUrl, "confirmed")
}

/**
 * Get account balance in SOL
 */
export async function getBalance(publicKey: string): Promise<number> {
  try {
    const connection = getTeosConnection()
    const pubKey = new PublicKey(publicKey)
    const balance = await connection.getBalance(pubKey)
    return balance / 1e9 // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching balance:", error)
    throw error
  }
}

/**
 * Get recent transaction signatures for an account
 */
export async function getRecentTransactions(publicKey: string, limit = 10): Promise<any[]> {
  try {
    const connection = getTeosConnection()
    const pubKey = new PublicKey(publicKey)
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit })
    return signatures
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

/**
 * Check if TEOS RPC is configured and healthy
 */
export async function checkTeosHealth(): Promise<boolean> {
  try {
    const connection = getTeosConnection()
    const version = await connection.getVersion()
    console.log("TEOS RPC version:", version)
    return true
  } catch (error) {
    console.error("TEOS RPC health check failed:", error)
    return false
  }
}

/**
 * Example usage:
 *
 * import { getBalance, getRecentTransactions } from '@/lib/integrations/solana'
 *
 * const balance = await getBalance('YourPublicKeyHere')
 * const txs = await getRecentTransactions('YourPublicKeyHere', 5)
 */
