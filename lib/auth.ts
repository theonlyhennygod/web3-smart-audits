import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
const sql = neon(process.env.DATABASE_URL!)
import { v4 as uuidv4 } from "uuid"

// Session duration in seconds (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60

export async function createSession(userId: string): Promise<string> {
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000)

  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt})
  `

  const cookieStore = await cookies()
  // Set session cookie
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })

  return sessionId
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    return { session: null }
  }

  const result = await sql`
    SELECT id, user_id, expires_at 
    FROM sessions 
    WHERE id = ${sessionId}
    LIMIT 1
  `

  if (result.length === 0 || new Date(result[0].expires_at) < new Date()) {
    // Session expired
    cookieStore.delete("session_id")
    return { session: null }
  }

  return {
    session: {
      id: result[0].id,
      userId: result[0].user_id,
    },
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (sessionId) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`
    cookieStore.delete("session_id")
  }
}

export async function getUser() {
  const { session } = await getSession()

  if (!session) {
    return null
  }

  const result = await sql`
    SELECT * FROM users WHERE id = ${session.userId} LIMIT 1
  `

  return result.length > 0 ? result[0] : null
}

export async function signInWithWallet(walletAddress: string) {
  // Check if user exists
  let result = await sql`
    SELECT * FROM users WHERE wallet_address = ${walletAddress} LIMIT 1
  `

  let user

  // If not, create a new user
  if (result.length === 0) {
    result = await sql`
      INSERT INTO users (wallet_address, role)
      VALUES (${walletAddress}, 'user')
      RETURNING *
    `
  }

  user = result[0]

  // Create a session
  const sessionId = await createSession(user.id)

  return { user, sessionId }
}
