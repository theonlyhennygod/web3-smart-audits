import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contractId, amount, currency, paymentMethod, transactionHash } = await request.json()

    if (!contractId || !amount || !currency || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert payment into database
    const result = await sql`
      INSERT INTO payments (
        user_id, contract_id, amount, currency, payment_method, transaction_hash, status
      )
      VALUES (
        ${user.id}, ${contractId}, ${amount}, ${currency}, 
        ${paymentMethod}, ${transactionHash || null}, 'completed'
      )
      RETURNING id
    `

    if (result.length === 0) {
      throw new Error("Failed to insert payment")
    }

    return NextResponse.json({
      success: true,
      paymentId: result[0].id,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
