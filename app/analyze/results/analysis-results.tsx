"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Download, ExternalLink, FileText, Info, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function AnalysisResults() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the analysis results
  const mockResults = {
    contractName: "TokenSwap.sol",
    riskScore: 72,
    vulnerabilities: [
      {
        id: "V001",
        severity: "high",
        title: "Reentrancy Vulnerability",
        description: "The contract is vulnerable to reentrancy attacks in the swap function.",
        codeSnippet:
          "function swap(address token, uint amount) public {\n  require(IERC20(token).transferFrom(msg.sender, address(this), amount));\n  // Vulnerable: External call before state update\n  payable(msg.sender).transfer(calculateReturn(amount));\n  balances[msg.sender] -= amount;\n}",
        recommendation: "Update the state variables before making external calls to prevent reentrancy attacks.",
      },
      {
        id: "V002",
        severity: "medium",
        title: "Integer Overflow",
        description: "Potential integer overflow in the calculateReturn function.",
        codeSnippet:
          "function calculateReturn(uint amount) internal returns (uint) {\n  // Potential overflow if rate is large\n  return amount * rate / 100;\n}",
        recommendation: "Use SafeMath library or Solidity 0.8.0+ to prevent integer overflows.",
      },
      {
        id: "V003",
        severity: "low",
        title: "Timestamp Dependence",
        description: "The contract uses block.timestamp for time-sensitive operations.",
        codeSnippet: "if (block.timestamp >= deadline) {\n  revert DeadlineExceeded();\n}",
        recommendation: "Be aware that miners can manipulate block.timestamp to a certain degree.",
      },
    ],
    gasAnalysis: {
      evmChains: [
        { name: "Ethereum", cost: "0.0032 ETH", usdEquivalent: "$7.20" },
        { name: "Polygon", cost: "0.42 MATIC", usdEquivalent: "$0.35" },
        { name: "Arbitrum", cost: "0.00042 ETH", usdEquivalent: "$0.95" },
      ],
      polkadotChains: [
        { name: "Polkadot", cost: "0.25 DOT", usdEquivalent: "$1.50" },
        { name: "Astar", cost: "2.5 ASTR", usdEquivalent: "$0.30" },
      ],
      functionCosts: [
        { name: "swap()", gas: 78000, percentage: 35 },
        { name: "addLiquidity()", gas: 65000, percentage: 29 },
        { name: "removeLiquidity()", gas: 52000, percentage: 23 },
        { name: "claimRewards()", gas: 30000, percentage: 13 },
      ],
    },
    optimizationSuggestions: [
      {
        title: "Use Packed Storage",
        description: "Pack multiple variables into a single storage slot to reduce gas costs.",
        potentialSavings: "~15% gas reduction",
      },
      {
        title: "Optimize Loop Operations",
        description: "Avoid unnecessary operations inside loops to reduce gas consumption.",
        potentialSavings: "~10% gas reduction",
      },
      {
        title: "Use Events for Cheaper Storage",
        description: "Use events instead of storage for data that doesn't need to be accessed on-chain.",
        potentialSavings: "~8% gas reduction",
      },
    ],
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "medium":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "low":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Contract Analysis: {mockResults.contractName}</CardTitle>
              <CardDescription>Analysis completed on April 26, 2025</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Contract
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security Analysis</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          ></circle>
                          <circle
                            className={`${getRiskColor(mockResults.riskScore)} stroke-current`}
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * mockResults.riskScore) / 100}
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-3xl font-bold ${getRiskColor(mockResults.riskScore)}`}>
                            {mockResults.riskScore}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">Medium Risk</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Contract requires attention before deployment
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Vulnerabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm">High</span>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500">
                          1
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm">Medium</span>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                          1
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-sm">Low</span>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          1
                        </Badge>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("security")}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Deployment Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ethereum</span>
                        <span className="text-sm font-medium">0.0032 ETH ($7.20)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Polygon</span>
                        <span className="text-sm font-medium">0.42 MATIC ($0.35)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Polkadot</span>
                        <span className="text-sm font-medium">0.25 DOT ($1.50)</span>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("cost")}>
                          View All Chains
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Security Recommendation</AlertTitle>
                  <AlertDescription>
                    This contract has a high-severity reentrancy vulnerability that should be fixed before deployment.
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("security")}>
                      View details
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Optimization Suggestions</h3>
                <div className="space-y-4">
                  {mockResults.optimizationSuggestions.map((suggestion, index) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 whitespace-nowrap">
                            {suggestion.potentialSavings}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Vulnerabilities Found</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500">
                      1 High
                    </Badge>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                      1 Medium
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                      1 Low
                    </Badge>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {mockResults.vulnerabilities.map((vulnerability) => (
                    <AccordionItem key={vulnerability.id} value={vulnerability.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={getSeverityColor(vulnerability.severity)}>
                            {vulnerability.severity.toUpperCase()}
                          </Badge>
                          <span>{vulnerability.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <p className="text-muted-foreground">{vulnerability.description}</p>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Vulnerable Code</h4>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                              <code>{vulnerability.codeSnippet}</code>
                            </pre>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">{vulnerability.recommendation}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Security Best Practices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Use Access Control</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-sm text-muted-foreground">
                          Implement proper access control mechanisms to restrict sensitive functions to authorized users
                          only.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Check-Effects-Interactions Pattern</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-sm text-muted-foreground">
                          Follow the check-effects-interactions pattern to prevent reentrancy attacks.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Use SafeMath</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-sm text-muted-foreground">
                          Use SafeMath library for arithmetic operations or use Solidity 0.8.0+ which has built-in
                          overflow checks.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Avoid Timestamp Dependence</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-sm text-muted-foreground">
                          Be cautious when using block.timestamp as it can be manipulated by miners within certain
                          limits.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cost">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Deployment Costs Across Chains</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">EVM Chains</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockResults.gasAnalysis.evmChains.map((chain, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span>{chain.name}</span>
                              <div className="text-right">
                                <div className="font-medium">{chain.cost}</div>
                                <div className="text-sm text-muted-foreground">{chain.usdEquivalent}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Polkadot Ecosystem</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockResults.gasAnalysis.polkadotChains.map((chain, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span>{chain.name}</span>
                              <div className="text-right">
                                <div className="font-medium">{chain.cost}</div>
                                <div className="text-sm text-muted-foreground">{chain.usdEquivalent}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Function Gas Costs</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {mockResults.gasAnalysis.functionCosts.map((func, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-mono text-sm">{func.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {func.gas.toLocaleString()} gas
                                </span>
                              </div>
                              <span className="text-sm">{func.percentage}%</span>
                            </div>
                            <Progress value={func.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Gas Optimization Recommendations</h3>
                  <div className="space-y-4">
                    {mockResults.optimizationSuggestions.map((suggestion, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">{suggestion.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 whitespace-nowrap">
                              {suggestion.potentialSavings}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Removed Additional Resources Section */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
