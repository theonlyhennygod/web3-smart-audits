"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Clock, FileText, Search } from "lucide-react"
import Link from "next/link"
// Removed formatCurrency import due to persistent resolution issues
// import { formatCurrency } from "../../lib/utils" // Use relative path if re-enabled
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children"

export function MarketplaceContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [chainFilter, setChainFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Mock data for the marketplace
  const mockContracts = [
    {
      id: "m001",
      name: "DeFi Lending Protocol",
      description: "A decentralized lending protocol with yield farming capabilities.",
      chain: "ethereum",
      contractType: "solidity",
      bountyAmount: 500,
      bountyToken: "USDC",
      status: "pending",
      submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      submittedAt: "2025-04-25T10:30:00Z",
    },
    {
      id: "m002",
      name: "NFT Marketplace",
      description: "A marketplace for trading NFTs with royalty distribution.",
      chain: "polkadot",
      contractType: "ink",
      bountyAmount: 200,
      bountyToken: "DOT",
      status: "pending",
      submittedBy: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      submittedAt: "2025-04-24T14:15:00Z",
    },
    {
      id: "m003",
      name: "Governance Token",
      description: "A governance token with delegation and voting mechanisms.",
      chain: "bsc",
      contractType: "solidity",
      bountyAmount: 300,
      bountyToken: "USDC",
      status: "in_progress",
      submittedBy: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      submittedAt: "2025-04-23T09:45:00Z",
    },
    {
      id: "m004",
      name: "Cross-Chain Bridge",
      description: "A bridge for transferring assets between Ethereum and Polkadot.",
      chain: "polkadot",
      contractType: "rust",
      bountyAmount: 1000,
      bountyToken: "DOT",
      status: "pending",
      submittedBy: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      submittedAt: "2025-04-22T16:20:00Z",
    },
    {
      id: "m005",
      name: "Staking Contract",
      description: "A staking contract with time-locked rewards.",
      chain: "ethereum",
      contractType: "solidity",
      bountyAmount: 250,
      bountyToken: "ETH",
      status: "pending",
      submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      submittedAt: "2025-04-21T11:10:00Z",
    },
  ]

  const getChainLabel = (chain: string) => {
    switch (chain) {
      case "ethereum":
        return "Ethereum"
      case "bsc":
        return "BSC"
      case "polkadot":
        return "Polkadot"
      default:
        return chain
    }
  }

  const getChainBadgeClass = (chain: string) => {
    switch (chain) {
      case "ethereum":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "bsc":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "polkadot":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "in_progress":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter and sort contracts
  const filteredContracts = mockContracts
    .filter((contract) => {
      // Filter by tab
      if (activeTab === "pending" && contract.status !== "pending") return false
      if (activeTab === "in_progress" && contract.status !== "in_progress") return false
      if (activeTab === "completed" && contract.status !== "completed") return false

      // Filter by search query
      if (searchQuery && !contract.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      // Filter by chain
      if (chainFilter !== "all" && contract.chain !== chainFilter) return false

      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === "newest") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      } else if (sortBy === "highest_bounty") {
        return b.bountyAmount - a.bountyAmount
      } else if (sortBy === "lowest_bounty") {
        return a.bountyAmount - b.bountyAmount
      }
      return 0
    })

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contracts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Select value={chainFilter} onValueChange={setChainFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                  <SelectItem value="polkadot">Polkadot</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest_bounty">Highest Bounty</SelectItem>
                  <SelectItem value="lowest_bounty">Lowest Bounty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button asChild className="animate-pulse-slow">
              <Link href="/analyze">Submit Contract</Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Contracts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AnimatePresence mode="wait">
            {filteredContracts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Contracts Found</h3>
                <p className="text-muted-foreground">
                  No contracts match your current filters. Try adjusting your search criteria.
                </p>
              </motion.div>
            ) : (
              <StaggerChildren className="grid grid-cols-1 gap-6">
                {filteredContracts.map((contract) => (
                  <StaggerItem key={contract.id}>
                    <Card className="bg-card border-border hover:glow-secondary transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-medium">{contract.name}</h3>
                                <Badge variant="outline" className={getChainBadgeClass(contract.chain)}>
                                  {getChainLabel(contract.chain)}
                                </Badge>
                                <Badge variant="outline" className={getStatusBadgeClass(contract.status)}>
                                  {contract.status.replace("_", " ").charAt(0).toUpperCase() +
                                    contract.status.replace("_", " ").slice(1)}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">{contract.description}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-xl font-bold">
                                {/* Display amount and token symbol directly */}
                                {contract.bountyAmount > 0 ? `${contract.bountyAmount} ${contract.bountyToken}` : 'No Bounty'}
                              </div>
                              {contract.bountyAmount > 0 && (
                                <div className="text-sm text-muted-foreground">Bounty</div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Submitted on {formatDate(contract.submittedAt)}</span>
                            </div>
                            <Button asChild className="group">
                              <Link href={`/marketplace/${contract.id}`}>
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}
