import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ethers } from "ethers"
import { signatureVerify } from "@polkadot/util-crypto"
import { u8aToHex, stringToU8a } from '@polkadot/util'
import { signInWithWallet } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

async function verifySignature(
  address: string,
  signature: string,
  message: string,
  network: 'ethereum' | 'polkadot'
): Promise<boolean> {
  if (network === 'ethereum') {
    try {
      // EVM signature verification
      const recoveredAddress = ethers.verifyMessage(message, signature)
      return recoveredAddress.toLowerCase() === address.toLowerCase()
    } catch (e) {
      console.error("EVM verification error:", e)
      return false
    }
  } else if (network === 'polkadot') {
    try {
      // Polkadot signature verification
      const { isValid } = signatureVerify(message, signature, address)
      return isValid
    } catch (e) {
      console.error("Polkadot verification error:", e)
      return false
    }
  }
  return false
}


export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, nonce, network } = await request.json()

    if (!walletAddress || !signature || !nonce || !network) {
      return NextResponse.json({ error: "Missing required fields (address, signature, nonce, network)" }, { status: 400 })
    }

    // 1. Retrieve the challenge from the database
    const challengeResult = await sql`
      SELECT nonce, expires_at 
      FROM auth_challenges 
      WHERE wallet_address = ${walletAddress}
      LIMIT 1
    `

    if (challengeResult.length === 0) {
      return NextResponse.json({ error: "Invalid or expired challenge" }, { status: 400 })
    }

    const storedNonce = challengeResult[0].nonce
    const expiresAt = new Date(challengeResult[0].expires_at)

    // 2. Check if the nonce matches and hasn't expired
    if (storedNonce !== nonce || expiresAt < new Date()) {
       // Clean up expired/used nonce
       await sql`DELETE FROM auth_challenges WHERE wallet_address = ${walletAddress}`
      return NextResponse.json({ error: "Invalid or expired challenge" }, { status: 400 })
    }

    // 3. Verify the signature
    const messageToVerify = `Please sign this message to log in: ${nonce}`
    const isValidSignature = await verifySignature(walletAddress, signature, messageToVerify, network)

    // 4. Clean up the used nonce regardless of verification result
    await sql`DELETE FROM auth_challenges WHERE wallet_address = ${walletAddress}`

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 5. Signature is valid, proceed with sign-in and session creation
    const { user, sessionId } = await signInWithWallet(walletAddress)

    // Optionally store network type with user if needed later
    // await sql`UPDATE users SET network = ${network} WHERE id = ${user.id}`

    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        role: user.role,
      },
      sessionId,
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
