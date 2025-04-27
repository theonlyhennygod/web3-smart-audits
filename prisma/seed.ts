import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
    update: {},
    create: {
      walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      displayName: "Admin",
      role: "admin",
    },
  })

  // Create auditor user
  const auditor = await prisma.user.upsert({
    where: { walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    update: {},
    create: {
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      displayName: "Auditor",
      role: "auditor",
      reputationScore: 95,
      completedAudits: 12,
    },
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { walletAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" },
    update: {},
    create: {
      walletAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      displayName: "User",
      role: "user",
    },
  })

  // Create sample contract submission
  const contract = await prisma.contractSubmission.upsert({
    where: { id: "c001" },
    update: {},
    create: {
      id: "c001",
      userId: user.id,
      contractName: "TokenSwap.sol",
      contractType: "solidity",
      chain: "ethereum",
      bountyAmount: 0,
      bountyToken: "USDC",
      status: "completed",
      riskScore: 72,
      contractCode: `
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;
        
        import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
        
        contract TokenSwap {
            address public owner;
            uint256 public rate = 100;
            mapping(address => uint256) public balances;
            
            constructor() {
                owner = msg.sender;
            }
            
            function swap(address token, uint amount) public {
                require(IERC20(token).transferFrom(msg.sender, address(this), amount)); // Vulnerable: External call before state update
                payable(msg.sender).transfer(calculateReturn(amount));
                balances[msg.sender] -= amount;
            }
            
            function calculateReturn(uint amount) internal returns (uint) {
                // Potential overflow if rate is large
                return amount * rate / 100;
            }
            
            function setRate(uint256 newRate) public {
                require(msg.sender == owner, "Only owner can set rate");
                rate = newRate;
            }
        }
      `,
    },
  })

  // Create sample audit findings
  await prisma.auditFinding.createMany({
    data: [
      {
        contractId: contract.id,
        title: "Reentrancy Vulnerability",
        description: "The contract is vulnerable to reentrancy attacks in the swap function.",
        severity: "high",
        codeSnippet: `function swap(address token, uint amount) public {
  require(IERC20(token).transferFrom(msg.sender, address(this), amount));
  // Vulnerable: External call before state update
  payable(msg.sender).transfer(calculateReturn(amount));
  balances[msg.sender] -= amount;
}`,
        recommendation: "Update the state variables before making external calls to prevent reentrancy attacks.",
      },
      {
        contractId: contract.id,
        title: "Integer Overflow",
        description: "Potential integer overflow in the calculateReturn function.",
        severity: "medium",
        codeSnippet: `function calculateReturn(uint amount) internal returns (uint) {
  // Potential overflow if rate is large
  return amount * rate / 100;
}`,
        recommendation: "Use SafeMath library or Solidity 0.8.0+ to prevent integer overflows.",
      },
    ],
  })

  // Create sample gas simulation
  await prisma.gasSimulation.create({
    data: {
      contractId: contract.id,
      chain: "ethereum",
      deploymentCost: "0.0032",
      deploymentCostUsd: "7.20",
      functionCosts: JSON.stringify([
        { name: "swap()", gas: 78000, percentage: 35 },
        { name: "addLiquidity()", gas: 65000, percentage: 29 },
        { name: "removeLiquidity()", gas: 52000, percentage: 23 },
        { name: "claimRewards()", gas: 30000, percentage: 13 },
      ]),
    },
  })

  console.log("Database seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
