import { NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"
import { getUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's contract submissions
    const contractsResult = await sql`
      SELECT * FROM contract_submissions 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `

    // Get user's payments
    const paymentsResult = await sql`
      SELECT * FROM payments 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `

    // For auditors, get their earnings
    let earnings = []
    if (user.role === "auditor") {
      earnings = await sql`
        SELECT * FROM payments 
        WHERE user_id = ${user.id} AND status = 'completed'
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        role: user.role,
        totalEarnings: user.total_earnings,
        reputationScore: user.reputation_score,
        completedAudits: user.completed_audits,
      },
      contracts: contractsResult,
      payments: paymentsResult,
      earnings,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
