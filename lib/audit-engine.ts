// This is a simplified version of the audit engine for demonstration purposes

// Static analysis patterns for common vulnerabilities
const vulnerabilityPatterns = {
  reentrancy: {
    pattern: /(\.\s*transfer\s*$$|\.\s*send\s*\(|\.call\s*\{.*\}\s*\(.*$$).*?;\s*(.*?=)/gs,
    description: "Potential reentrancy vulnerability: external call before state update",
    severity: "high",
    recommendation: "Update state variables before making external calls to prevent reentrancy attacks.",
  },
  txOrigin: {
    pattern: /tx\s*\.\s*origin/g,
    description: "Use of tx.origin for authorization",
    severity: "high",
    recommendation: "Use msg.sender instead of tx.origin for authorization checks.",
  },
  delegatecall: {
    pattern: /\.\s*delegatecall\s*\(/g,
    description: "Use of delegatecall",
    severity: "medium",
    recommendation: "Be cautious with delegatecall as it can lead to unexpected behavior and security vulnerabilities.",
  },
  noSafeMath: {
    pattern: /(\+\+|--|\+|-|\*|\/)/g,
    description: "Arithmetic operations without SafeMath",
    severity: "medium",
    recommendation: "Use SafeMath library or Solidity 0.8.0+ to prevent integer overflows.",
  },
  timestamp: {
    pattern: /block\s*\.\s*timestamp/g,
    description: "Timestamp dependence",
    severity: "low",
    recommendation: "Be aware that miners can manipulate block.timestamp to a certain degree.",
  },
  assembly: {
    pattern: /assembly\s*\{/g,
    description: "Use of inline assembly",
    severity: "low",
    recommendation: "Inline assembly is error-prone and should be used with caution.",
  },
  noAccessControl: {
    pattern: /function\s+\w+\s*$$[^)]*$$\s*(public|external)(?!\s+view|\s+pure|\s+onlyOwner)/g,
    description: "Public function without access control",
    severity: "medium",
    recommendation: "Consider adding access control to sensitive functions.",
  },
  // --- ink! Specific Patterns ---
  inkUncheckedArithmetic: {
    // Look for basic arithmetic operators outside of checked_* methods in ink! context
    // This is a simplified pattern and might need refinement
    pattern: /[^a-zA-Z0-9_](self\.)?\w+\s*[\+\-\*\/]\s*(self\.)?\w+/g,
    description: "Potential unchecked arithmetic in ink! contract",
    severity: "medium",
    recommendation: "Use checked_add, checked_sub, checked_mul, checked_div methods for arithmetic operations in ink! to prevent overflows/underflows.",
  },
  inkDelegateCall: {
    // Look for delegate_call usage
    pattern: /delegate_call/g,
    description: "Use of delegate_call in ink! contract",
    severity: "high", // Often riskier than EVM delegatecall if not handled carefully
    recommendation: "delegate_call is powerful but risky. Ensure the called contract's storage layout is compatible and logic is fully trusted.",
  },
  inkUnrestrictedSelector: {
    // Look for #[ink(message)] without #[ink(selector = ...)] which might lead to selector collisions
    // This pattern is very basic and might have false positives/negatives
    pattern: /#\[ink\(message\)\]\s*(?!.*#\[ink\(selector\s*=)/g,
    description: "ink! message without explicit selector",
    severity: "low",
    recommendation: "Consider specifying explicit selectors for ink! messages using #[ink(selector = ...)] to avoid potential collisions, especially in complex inheritance scenarios.",
  },
}

export interface AuditFinding {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low" | "info"
  codeSnippet?: string
  recommendation: string
  lineNumber?: number
}

export interface AuditResult {
  findings: AuditFinding[]
  riskScore: number
  summary: string
}

// Function to analyze contract code for vulnerabilities
export function analyzeContract(code: string, contractType?: 'solidity' | 'ink' | 'rust'): AuditResult { // Added contractType parameter
  const findings: AuditFinding[] = []
  let id = 1

  // Determine which patterns to apply based on contract type
  const patternsToApply = Object.entries(vulnerabilityPatterns).filter(([key]) => {
    if (contractType === 'solidity') {
      // Apply EVM/Solidity specific patterns + general ones
      return !key.startsWith('ink'); // Example: Exclude ink patterns for solidity
    } else if (contractType === 'ink' || contractType === 'rust') {
       // Apply ink!/Rust specific patterns + general ones (adjust as needed)
       return !key.startsWith('solidity') && !key.includes('noSafeMath') && !key.includes('txOrigin'); // Example: Exclude solidity patterns
    }
    // Default: apply all if type is unknown (or adjust as needed)
    return true;
  });


  // Check for each applicable vulnerability pattern
  for (const [key, vulnerability] of patternsToApply) {
    // Ensure pattern is a RegExp object if it's stored as a string initially
    const regex = vulnerability.pattern instanceof RegExp ? vulnerability.pattern : new RegExp(vulnerability.pattern);
    const matches = code.match(regex); // Use the RegExp object

    if (matches && matches.length > 0) {
      // Extract code snippet around the first match for simplicity
      const match = matches[0]
      const matchIndex = code.indexOf(match)
      const linesBefore = code.substring(0, matchIndex).split("\n").length

      // Get a few lines of context around the vulnerability
      const lines = code.split("\n")
      const startLine = Math.max(0, linesBefore - 2)
      const endLine = Math.min(lines.length, linesBefore + 3)
      const codeSnippet = lines.slice(startLine, endLine).join("\n")

      findings.push({
        id: `V${id.toString().padStart(3, "0")}`,
        title: `${key.charAt(0).toUpperCase() + key.slice(1)} Vulnerability`,
        description: vulnerability.description,
        severity: vulnerability.severity as "high" | "medium" | "low" | "info",
        codeSnippet,
        recommendation: vulnerability.recommendation,
        lineNumber: linesBefore,
      })

      id++
    }
  }

  // Calculate risk score based on findings
  const riskScore = calculateRiskScore(findings)

  // Generate summary
  const summary = generateSummary(findings, riskScore)

  return {
    findings,
    riskScore,
    summary,
  }
}

// Calculate risk score based on findings
function calculateRiskScore(findings: AuditFinding[]): number {
  if (findings.length === 0) return 0

  const severityWeights = {
    high: 10,
    medium: 5,
    low: 2,
    info: 0.5,
  }

  const totalWeight = findings.reduce((sum, finding) => {
    return sum + (severityWeights[finding.severity] || 0)
  }, 0)

  // Normalize to 0-100 scale
  const normalizedScore = Math.min(100, Math.round(totalWeight * 5))

  return normalizedScore
}

// Generate summary based on findings and risk score
function generateSummary(findings: AuditFinding[], riskScore: number): string {
  const highCount = findings.filter((f) => f.severity === "high").length
  const mediumCount = findings.filter((f) => f.severity === "medium").length
  const lowCount = findings.filter((f) => f.severity === "low").length

  let riskLevel = "minimal"
  if (riskScore >= 80) riskLevel = "high"
  else if (riskScore >= 60) riskLevel = "medium"
  else if (riskScore >= 40) riskLevel = "moderate"
  else if (riskScore >= 20) riskLevel = "low"

  return `The contract has a ${riskLevel} risk level with a score of ${riskScore}/100. Analysis found ${findings.length} issues: ${highCount} high, ${mediumCount} medium, and ${lowCount} low severity vulnerabilities.`
} // Add missing closing brace for generateSummary

// --- Move imports and simulation logic outside of generateSummary ---
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Hardhat setup - assumes hardhat config is in ./hardhat relative to project root
const hardhatDir = path.resolve(process.cwd(), 'hardhat');
const hardhatConfigPath = path.join(hardhatDir, 'hardhat.config.ts');
const tempContractDir = path.join(hardhatDir, 'contracts', 'temp');


// Function to simulate gas costs for contract deployment and function calls
export async function simulateGasCosts(
  contractCode: string,
  contractType: 'solidity' | 'ink' | 'rust', // Use contractType enum from prisma?
  chain: string // Keep chain for potential future use (e.g. Polkadot)
): Promise<any> { // Define a proper return type later

  if (contractType !== 'solidity') {
    // TODO: Implement simulation for ink!/Rust using cargo-contract
    console.warn(`Gas simulation for ${contractType} is not yet implemented. Returning mock data.`);
    // Return mock data for non-Solidity for now
    const mockGasSimulation = {
      chain: chain || "polkadot", // Default to polkadot if chain unknown
      deploymentGas: 2500000,
      deploymentCost: "0.25",
      deploymentCostUsd: "1.50",
      functionCosts: [],
      tokenPrice: 6,
    };
    return mockGasSimulation;
  }

  // --- Hardhat Simulation for Solidity ---
  let deploymentGas = 0;
  let deploymentCost = '0';
  let deploymentCostUsd = '0';
  let functionCosts: any[] = [];
  const tempContractPath = path.join(tempContractDir, `TempContract_${Date.now()}.sol`);
  const contractName = "TempContract"; // Assume contract name matches temp file name for simplicity

  try {
    // 1. Ensure temp directory exists
    await fs.mkdir(tempContractDir, { recursive: true });

    // 2. Write contract code to temporary file
    await fs.writeFile(tempContractPath, contractCode);

    // 3. Run Hardhat compile and run script via CLI
    // We use CLI because running Hardhat programmatically within Next.js API routes can be complex
    // A dedicated script handles compilation, deployment, and gas estimation
    const scriptPath = path.join(hardhatDir, 'scripts', 'simulateGas.ts'); // We need to create this script

    // Create the simulation script if it doesn't exist
    await ensureSimulationScriptExists(scriptPath);

    console.log(`Running Hardhat simulation script: ${scriptPath} for contract: ${tempContractPath}`);

    // Execute the hardhat script using the CLI, passing contract path and name
    // Ensure paths are handled correctly, especially spaces
    const command = `npx hardhat run "${scriptPath}" --network hardhat --config "${hardhatConfigPath}" --contract-path "${tempContractPath}" --contract-name ${contractName}`;
    console.log(`Executing command: ${command}`);

    const { stdout, stderr } = await execAsync(command, { cwd: hardhatDir }); // Run from hardhat directory

    if (stderr) {
      console.error(`Hardhat simulation stderr: ${stderr}`);
      // Don't necessarily throw an error, Hardhat might output warnings to stderr
    }
    console.log(`Hardhat simulation stdout: ${stdout}`);

    // 4. Parse the output from the script
    // The script should output JSON with gas estimates
    const simulationOutput = JSON.parse(stdout.substring(stdout.indexOf('{'))); // Find the start of JSON output
    deploymentGas = simulationOutput.deploymentGas || 0;
    functionCosts = simulationOutput.functionCosts || [];

    // TODO: Calculate cost based on gas and mock price (or fetch real price)
    const mockGasPriceGwei = 50; // Mock Gwei price
    const mockEthPriceUsd = 2500; // Mock ETH price
    deploymentCost = ((deploymentGas * mockGasPriceGwei) / 1e9).toFixed(6);
    deploymentCostUsd = (parseFloat(deploymentCost) * mockEthPriceUsd).toFixed(2);
    functionCosts = functionCosts.map(fc => ({
      ...fc,
      cost: ((fc.gas * mockGasPriceGwei) / 1e9).toFixed(8),
      costUsd: (((fc.gas * mockGasPriceGwei) / 1e9) * mockEthPriceUsd).toFixed(2)
    }));


  } catch (error: any) {
    console.error(`Error during Hardhat simulation: ${error.message}`);
    // Return mock data or indicate failure
     return {
      error: `Simulation failed: ${error.message}`,
      chain,
      deploymentGas: 0,
      deploymentCost: '0',
      deploymentCostUsd: '0',
      functionCosts: [],
    };
  } finally {
    // 5. Clean up temporary contract file
    try {
      await fs.unlink(tempContractPath);
    } catch (cleanupError) {
      console.error(`Failed to cleanup temporary contract file: ${tempContractPath}`, cleanupError);
    }
  }


  return {
    chain: chain || 'ethereum', // Default to ethereum if chain unknown
    deploymentGas,
    deploymentCost,
    deploymentCostUsd,
    functionCosts,
    tokenPrice: 2500, // Mock ETH price for now
  };


  // --- Original Mock Logic ---
  /*
  // Mock gas costs for different chains
  const chainCosts = { // Keep this structure for reference or non-solidity fallback
    ethereum: {
      gasPrice: 50, // Gwei - Mock
      deploymentGas: 2000000, // Mock
      functionCalls: { // Mock
        transfer: 65000,
        approve: 45000,
        mint: 70000,
        burn: 50000,
      },
    },
    bsc: { // Mock
      gasPrice: 5, // Gwei
      deploymentGas: 2000000,
      functionCalls: {
        transfer: 65000,
        approve: 45000,
        mint: 70000,
        burn: 50000,
      },
    },
    polygon: { // Mock
      gasPrice: 30, // Gwei
      deploymentGas: 2000000,
      functionCalls: {
        transfer: 65000,
        approve: 45000,
        mint: 70000,
        burn: 50000,
      },
    },
    polkadot: { // Mock
      // Polkadot uses weight instead of gas, but we'll simplify for this example
      gasPrice: 0.1, // DOT per million gas - Mock
      deploymentGas: 2500000, // Mock
      functionCalls: { // Mock
        transfer: 80000,
        approve: 60000,
        mint: 90000,
        burn: 70000,
      },
    },
  }
  */
}

// Helper function to create the simulation script if it doesn't exist
async function ensureSimulationScriptExists(scriptPath: string) {
  try {
    await fs.access(scriptPath);
    // console.log("Simulation script already exists.");
  } catch {
    console.log("Creating Hardhat simulation script...");
    const scriptContent = `
import { ethers } from "hardhat";
import { parseArgs } from "util"; // Node.js util for parsing args
import fs from "fs/promises";
import path from "path";

async function main() {
  // Basic argument parsing - expects --contract-path and --contract-name
  const args = process.argv.slice(2); // Remove 'node' and script path
  const contractPathIndex = args.findIndex(arg => arg === '--contract-path');
  const contractNameIndex = args.findIndex(arg => arg === '--contract-name');

  if (contractPathIndex === -1 || contractNameIndex === -1 || args.length < 4) {
    console.error("Usage: npx hardhat run <script> --network <network> --contract-path <path> --contract-name <name>");
    process.exit(1);
  }

  const contractPath = args[contractPathIndex + 1];
  const contractName = args[contractNameIndex + 1];

  // console.log(\`Simulating for contract: \${contractName} at \${contractPath}\`);

  let deploymentGas = 0;
  const functionCosts: { name: string; gas: number }[] = [];

  try {
    // Compile implicitly handled by Hardhat run if needed, or ensure compiled beforehand
    // console.log("Getting contract factory...");
    const ContractFactory = await ethers.getContractFactory(contractName);

    // console.log("Estimating deployment gas...");
    const deploymentTx = await ContractFactory.getDeployTransaction();
    deploymentGas = Number(await ethers.provider.estimateGas(deploymentTx)); // Convert BigInt to Number

    // console.log(\`Estimated deployment gas: \${deploymentGas}\`);

    // --- Function Gas Estimation (Basic Example) ---
    // Deploy first to estimate function calls on an instance
    // console.log("Deploying contract for function estimation...");
    // Note: This deployment uses gas on the target network (Hardhat local here)
    const contractInstance = await ContractFactory.deploy(); // Add constructor args if needed
    await contractInstance.waitForDeployment();
    const contractAddress = await contractInstance.getAddress();
    // console.log(\`Contract deployed to: \${contractAddress}\`);

    // Get public function signatures from ABI
    const abi = ContractFactory.interface.fragments;
    for (const fragment of abi) {
      if (fragment.type === 'function' && (fragment.stateMutability === 'nonpayable' || fragment.stateMutability === 'payable')) {
         // console.log(\`Estimating gas for function: \${fragment.name}\`);
         try {
            // Prepare dummy arguments based on function inputs (requires more complex logic for real use)
            // For now, we'll try estimating without arguments or with zero values if possible
            const dummyArgs = fragment.inputs.map(input => {
                 // Basic dummy data - needs improvement for complex types
                if (input.type.includes('uint')) return 0;
                if (input.type.includes('address')) return ethers.ZeroAddress;
                if (input.type.includes('bool')) return false;
                if (input.type.includes('bytes')) return '0x';
                return ''; // Default for string etc.
            });

           const estimatedGas = await contractInstance[fragment.name].estimateGas(...dummyArgs);
           functionCosts.push({ name: fragment.name, gas: Number(estimatedGas) });
           // console.log(\`  - Estimated gas for \${fragment.name}: \${Number(estimatedGas)}\`);
         } catch (estimateError: any) {
            // console.warn(\`Could not estimate gas for function \${fragment.name}: \${estimateError.message}\`);
            // Optionally add function with gas 0 or skip
             functionCosts.push({ name: fragment.name, gas: 0 });
         }
      }
    }

  } catch (error: any) {
    console.error(\`Simulation script error: \${error.message}\`);
    // Output partial results if available, or indicate failure
  }

  // Output results as JSON to stdout for the calling process
  console.log(JSON.stringify({
    deploymentGas,
    functionCosts
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  // Ensure JSON output even on error for parsing consistency
  console.log(JSON.stringify({ deploymentGas: 0, functionCosts: [], error: error.message }));
});
    `;
    await fs.writeFile(scriptPath, scriptContent);
    console.log("Hardhat simulation script created.");
  }
}
