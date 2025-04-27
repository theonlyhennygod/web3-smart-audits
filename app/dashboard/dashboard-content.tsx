"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, FileText, Shield, Wallet, PlusCircle } from "lucide-react" // Added PlusCircle
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // Import Table components

// Removed formatCurrency import due to persistent resolution issues
// import { formatCurrency } from "../../lib/utils"

// Mock data for the dashboard (assuming this will be replaced by fetched data)
const mockSubmissions = [
  {
    id: "c001",
    name: "TokenSwap.sol",
    date: "April 26, 2025",
    riskScore: 72,
    status: "completed",
  },
  {
    id: "c002",
    name: "Staking.sol",
    date: "April 24, 2025",
    riskScore: 85,
    status: "completed",
  },
  {
    id: "c003",
    name: "NFTMarketplace.sol",
    date: "April 20, 2025",
    riskScore: 45,
    status: "completed",
  },
]

const mockAudits = [
  {
    id: "a001",
    name: "DeFi Lending Protocol",
    date: "April 25, 2025",
    bounty: 500,
    bountyToken: "USDC",
    status: "in_progress",
  },
  {
    id: "a002",
    name: "Governance Token",
    date: "April 23, 2025",
    bounty: 300,
    bountyToken: "USDC",
    status: "completed",
  },
]

const mockEarnings = [
  {
    id: "e001",
    name: "Governance Token Audit",
    date: "April 23, 2025",
    amount: 300,
    token: "USDC",
    status: "paid",
  },
  {
    id: "e002",
    name: "NFT Marketplace Audit",
    date: "April 15, 2025",
    amount: 450,
    token: "USDC",
    status: "paid",
  },
]

// Helper functions for badges (keep as is)
const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
          High Risk
        </Badge>
      )
    } else if (score >= 60) {
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
          Medium Risk
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Low Risk
        </Badge>
      )
    }
  }

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Completed
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
          In Progress
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
          Pending
        </Badge>
      )
    case "paid":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Paid
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/30">
          {status}
        </Badge>
      )
  }
}


export function DashboardContent() {
  // Removed activeTab state as we are removing tabs

  return (
    <div className="space-y-8"> {/* Increased spacing */}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm"> {/* Added subtle background */}
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">My Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">Contracts submitted for analysis</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
           <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">My Audits</CardTitle>
             <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAudits.length}</div>
             <p className="text-xs text-muted-foreground">Contracts currently being audited</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm">
           <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
             <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${mockEarnings.reduce((sum, earning) => sum + earning.amount, 0).toFixed(2)}
            </div>
             <p className="text-xs text-muted-foreground">From completed audits (USD)</p>
          </CardContent>
        </Card>
      </div>

      {/* My Submissions Section */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
           <h2 className="text-2xl font-semibold tracking-tight">My Submissions</h2>
            <Button size="sm" asChild>
              <Link href="/analyze">
                <PlusCircle className="mr-2 h-4 w-4" /> Submit New
              </Link>
            </Button>
         </div>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardContent className="p-0"> {/* Remove padding for full-width table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Name</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.length > 0 ? (
                  mockSubmissions.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.name}</TableCell>
                      <TableCell>{contract.date}</TableCell>
                      <TableCell>{getRiskBadge(contract.riskScore)}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/analyze/results?id=${contract.id}`}>
                            View Report
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No submissions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       {/* My Audits Section */}
       <div className="space-y-4">
         <h2 className="text-2xl font-semibold tracking-tight">My Audits</h2>
         <Card className="bg-card/80 backdrop-blur-sm">
           <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Contract Name</TableHead>
                   <TableHead>Date Assigned</TableHead>
                   <TableHead>Bounty</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {mockAudits.length > 0 ? (
                   mockAudits.map((audit) => (
                     <TableRow key={audit.id}>
                       <TableCell className="font-medium">{audit.name}</TableCell>
                       <TableCell>{audit.date}</TableCell>
                       <TableCell>{audit.bounty} {audit.bountyToken}</TableCell>
                       <TableCell>{getStatusBadge(audit.status)}</TableCell>
                       <TableCell className="text-right">
                         <Button variant="outline" size="sm" asChild>
                           <Link href={`/audits/${audit.id}`}>
                             {audit.status === "in_progress" ? "Continue Audit" : "View Details"}
                           </Link>
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={5} className="h-24 text-center">
                       No active audits. <Link href="/marketplace" className="text-primary underline">Browse marketplace?</Link>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       </div>

       {/* My Earnings Section */}
       <div className="space-y-4">
         <h2 className="text-2xl font-semibold tracking-tight">My Earnings</h2>
         <Card className="bg-card/80 backdrop-blur-sm">
           <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Audit Task</TableHead>
                   <TableHead>Date Paid</TableHead>
                   <TableHead>Amount</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {mockEarnings.length > 0 ? (
                   mockEarnings.map((earning) => (
                     <TableRow key={earning.id}>
                       <TableCell className="font-medium">{earning.name}</TableCell>
                       <TableCell>{earning.date}</TableCell>
                       <TableCell className="text-green-500">{earning.amount} {earning.token}</TableCell>
                       <TableCell>{getStatusBadge(earning.status)}</TableCell>
                       <TableCell className="text-right">
                         <Button variant="outline" size="sm" asChild>
                           <Link href={`/earnings/${earning.id}`}> {/* Assuming an earnings detail page */}
                             View Details
                           </Link>
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={5} className="h-24 text-center">
                       No earnings yet.
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       </div>

    </div>
  )
}
