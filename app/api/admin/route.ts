import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"
import { getUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all contracts
    const contractsResult = await sql`
      SELECT cs.*, u.wallet_address, u.display_name
      FROM contract_submissions cs
      JOIN users u ON cs.user_id = u.id
      ORDER BY cs.created_at DESC
    `

    // Get all users
    const usersResult = await sql`
      SELECT * FROM users
      ORDER BY created_at DESC
    `

    // Get all payments
    const paymentsResult = await sql`
      SELECT p.*, u.wallet_address, cs.contract_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN contract_submissions cs ON p.contract_id = cs.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json({
      contracts: contractsResult,
      users: usersResult,
      payments: paymentsResult,
    })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, id, data } = await request.json()

    if (!action || !id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result

    switch (action) {
      case "approveContract":
        result = await sql`
          UPDATE contract_submissions 
          SET status = 'completed'
          WHERE id = ${id}
          RETURNING *
        `
        break

      case "rejectContract":
        result = await sql`
          UPDATE contract_submissions 
          SET status = 'rejected'
          WHERE id = ${id}
          RETURNING *
        `
        break

      case "updateUser":
        if (!data || !data.role) {
          return NextResponse.json({ error: "Missing user data" }, { status: 400 })
        }

        result = await sql`
          UPDATE users 
          SET role = ${data.role}
          WHERE id = ${id}
          RETURNING *
        `
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (result.length === 0) {
      throw new Error("Failed to perform action")
    }

    return NextResponse.json({
      success: true,
      result: result[0],
      message: "Action performed successfully",
    })
  } catch (error) {
    console.error("Error performing admin action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
