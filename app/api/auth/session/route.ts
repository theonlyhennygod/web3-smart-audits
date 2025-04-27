import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Don't expose sensitive information
    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
