import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client
const sql = neon(process.env.DATABASE_URL!)

// Create a Drizzle client
export const db = drizzle(sql)

// Helper functions for database operations

// User related functions
export async function getUserByWalletAddress(walletAddress: string) {
  const result = await sql`
    SELECT * FROM users WHERE wallet_address = ${walletAddress} LIMIT 1
  `
  return result.length > 0 ? result[0] : null
}

export async function createUser(data: {
  walletAddress: string
  displayName?: string
  email?: string
  role?: "user" | "auditor" | "admin"
}) {
  const result = await sql`
    INSERT INTO users (wallet_address, display_name, email, role)
    VALUES (${data.walletAddress}, ${data.displayName || null}, ${data.email || null}, ${data.role || "user"})
    RETURNING *
  `
  return result[0]
}

// Contract submission related functions
export async function getContractSubmissions(userId?: string) {
  if (userId) {
    return sql`
      SELECT * FROM contract_submissions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
  }
  return sql`
    SELECT * FROM contract_submissions 
    ORDER BY created_at DESC
  `
}

export async function getContractSubmission(id: string) {
  const result = await sql`
    SELECT * FROM contract_submissions WHERE id = ${id} LIMIT 1
  `
  return result.length > 0 ? result[0] : null
}

export async function createContractSubmission(data: {
  userId: string
  contractName: string
  contractAddress?: string
  contractType: "solidity" | "ink" | "rust"
  chain: "ethereum" | "bsc" | "polkadot" | "kusama" | "other"
  bountyAmount?: number
  bountyToken: "DOT" | "USDC" | "ETH"
  contractCode?: string
}) {
  const result = await sql`
    INSERT INTO contract_submissions (
      user_id, contract_name, contract_address, contract_type, 
      chain, bounty_amount, bounty_token, contract_code
    )
    VALUES (
      ${data.userId}, ${data.contractName}, ${data.contractAddress || null}, 
      ${data.contractType}, ${data.chain}, ${data.bountyAmount || 0}, 
      ${data.bountyToken}, ${data.contractCode || null}
    )
    RETURNING *
  `
  return result[0]
}

// Audit findings related functions
export async function getAuditFindings(contractId: string) {
  return sql`
    SELECT * FROM audit_findings 
    WHERE contract_id = ${contractId}
  `
}

// Gas simulation related functions
export async function getGasSimulations(contractId: string) {
  return sql`
    SELECT * FROM gas_simulations 
    WHERE contract_id = ${contractId}
  `
}

// Payment related functions
export async function getUserPayments(userId: string) {
  return sql`
    SELECT * FROM payments 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
}
