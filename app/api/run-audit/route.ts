import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless" // Import neon function
import { getUser } from "@/lib/auth"
import { analyzeContract, simulateGasCosts } from "@/lib/audit-engine" // Import functions from library

const sql = neon(process.env.DATABASE_URL!) // Initialize sql tagged template literal

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contractId } = await request.json()

    if (!contractId) {
      return NextResponse.json({ error: "Contract ID is required" }, { status: 400 })
    }

    // Get contract from database
    const contractResult = await sql`
      SELECT * FROM contract_submissions WHERE id = ${contractId} LIMIT 1
    `

    if (contractResult.length === 0) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    const contract = contractResult[0]
    const contractCode = contract.contract_code

    if (!contractCode) {
      return NextResponse.json({ error: "Contract code not found" }, { status: 400 })
    }

    // Run static analysis using the library function, passing the contract type
    const analysisResult = analyzeContract(contractCode, contract.contract_type)
    const { findings, riskScore, summary } = analysisResult

    // Update contract with risk score
    await sql`
      UPDATE contract_submissions 
      SET risk_score = ${riskScore}, status = 'completed'
      WHERE id = ${contractId}
    `

    // Insert findings into database
    for (const finding of findings) {
      await sql`
        INSERT INTO audit_findings (
          contract_id, title, description, severity, code_snippet, recommendation
        )
        VALUES (
          ${contractId}, ${finding.title}, ${finding.description}, 
          ${finding.severity}, ${finding.codeSnippet}, ${finding.recommendation} // Corrected typo: codeSnippet
        )
      `
    }

    // Simulate gas costs (still using mock function for now)
    // TODO: Replace with actual simulation logic
    const gasSimulation = simulateGasCosts(contractCode, contract.chain)

    // Save gas simulation results
    await sql`
      INSERT INTO gas_simulations (
        contract_id, chain, deployment_cost, deployment_cost_usd, function_costs
      )
      VALUES (
        ${contractId}, ${gasSimulation.chain}, ${gasSimulation.deploymentCost},
        ${gasSimulation.deploymentCostUsd}, ${JSON.stringify(gasSimulation.functionCosts)}
      )
      ON CONFLICT (contract_id) DO UPDATE SET -- Update if simulation already exists
        chain = EXCLUDED.chain,
        deployment_cost = EXCLUDED.deployment_cost,
        deployment_cost_usd = EXCLUDED.deployment_cost_usd,
        function_costs = EXCLUDED.function_costs
    `

    return NextResponse.json({
      success: true,
      riskScore,
      findings, // Return findings from analysisResult
      gasSimulation, // Return gas simulation results
      summary, // Return summary from analysisResult
      message: "Audit analysis completed successfully (Gas simulation is currently mocked)",
    })
  } catch (error) {
    console.error("Error running audit:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
