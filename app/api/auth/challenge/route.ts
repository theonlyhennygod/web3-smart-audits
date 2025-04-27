import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { randomBytes } from "crypto"

const sql = neon(process.env.DATABASE_URL!)

// Nonce validity duration in milliseconds (e.g., 5 minutes)
const NONCE_VALIDITY_DURATION = 5 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Generate a secure random nonce
    const nonce = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + NONCE_VALIDITY_DURATION)

    // Store the nonce, associating it with the wallet address and setting an expiry
    // Use ON CONFLICT to update the nonce if a challenge already exists for the address
    await sql`
      INSERT INTO auth_challenges (wallet_address, nonce, expires_at)
      VALUES (${walletAddress}, ${nonce}, ${expiresAt})
      ON CONFLICT (wallet_address) DO UPDATE 
      SET nonce = EXCLUDED.nonce, expires_at = EXCLUDED.expires_at
    `

    // Return the nonce to the client
    return NextResponse.json({ nonce })

  } catch (error) {
    console.error("Challenge generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
