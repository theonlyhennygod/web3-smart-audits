import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.contractName || !data.contractType || !data.chain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert contract submission into database
    const result = await sql`
      INSERT INTO contract_submissions (
        user_id, contract_name, contract_address, contract_type, 
        chain, bounty_amount, bounty_token, contract_code, status
      )
      VALUES (
        ${user.id}, ${data.contractName}, ${data.contractAddress || null}, 
        ${data.contractType}, ${data.chain}, ${data.bountyAmount || 0}, 
        ${data.bountyToken || "USDC"}, ${data.contractCode || null}, 'pending'
      )
      RETURNING id
    `

    if (result.length === 0) {
      throw new Error("Failed to insert contract submission")
    }

    return NextResponse.json({
      success: true,
      contractId: result[0].id,
      message: "Contract submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting contract:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
