"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check, Clock, FileText, Search, User, X } from "lucide-react"
import Link from "next/link"
// Removed formatCurrency import
// import { formatCurrency } from "@/lib/utils"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("contracts")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for the admin panel
  const mockContracts = [
    {
      id: "c001",
      name: "TokenSwap.sol",
      submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      date: "April 26, 2025",
      status: "completed",
      bountyAmount: 0,
      bountyToken: "USDC",
    },
    {
      id: "c002",
      name: "Staking.sol",
      submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      date: "April 24, 2025",
      status: "completed",
      bountyAmount: 0,
      bountyToken: "USDC",
    },
    {
      id: "m001",
      name: "DeFi Lending Protocol",
      submittedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      date: "April 25, 2025",
      status: "pending",
      bountyAmount: 500,
      bountyToken: "USDC",
    },
    {
      id: "m002",
      name: "NFT Marketplace",
      submittedBy: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      date: "April 24, 2025",
      status: "pending",
      bountyAmount: 200,
      bountyToken: "DOT",
    },
    {
      id: "m003",
      name: "Governance Token",
      submittedBy: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      date: "April 23, 2025",
      status: "in_progress",
      bountyAmount: 300,
      bountyToken: "USDC",
    },
  ]

  const mockUsers = [
    {
      id: "u001",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      displayName: "Alice",
      role: "user",
      contractsSubmitted: 2,
      auditsCompleted: 0,
      joinedDate: "April 15, 2025",
    },
    {
      id: "u002",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      displayName: "Bob",
      role: "auditor",
      contractsSubmitted: 1,
      auditsCompleted: 3,
      joinedDate: "April 10, 2025",
    },
    {
      id: "u003",
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      displayName: "Charlie",
      role: "auditor",
      contractsSubmitted: 0,
      auditsCompleted: 5,
      joinedDate: "April 5, 2025",
    },
    {
      id: "u004",
      address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      displayName: "Dave",
      role: "admin",
      contractsSubmitted: 0,
      auditsCompleted: 0,
      joinedDate: "April 1, 2025",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Completed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            Pending
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
            {status}
          </Badge>
        )
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
            Admin
          </Badge>
        )
      case "auditor":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Auditor
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            User
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
            {role}
          </Badge>
        )
    }
  }

  // Filter contracts based on search query and status filter
  const filteredContracts = mockContracts.filter((contract) => {
    if (statusFilter !== "all" && contract.status !== statusFilter) return false
    if (searchQuery && !contract.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Filter users based on search query
  const filteredUsers = mockUsers.filter((user) => {
    if (
      searchQuery &&
      !user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage all aspects of the platform</CardDescription>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contracts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="contracts">
              <div className="flex justify-between mb-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredContracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Contracts Found</h3>
                    <p className="text-muted-foreground">
                      No contracts match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                ) : (
                  filteredContracts.map((contract) => (
                    <Card key={contract.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{contract.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{contract.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            {getStatusBadge(contract.status)}
                            {contract.bountyAmount > 0 && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                {/* Display amount and token directly */}
                                {contract.bountyAmount} {contract.bountyToken} Bounty
                              </Badge>
                            )}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/analyze/results?id=${contract.id}`}>View Details</Link>
                              </Button>
                              {contract.status === "pending" && (
                                <>
                                  <Button variant="outline" size="sm" className="text-green-500">
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-500">
                                    <X className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Users Found</h3>
                    <p className="text-muted-foreground">
                      No users match your current search. Try adjusting your search criteria.
                    </p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                              <User className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{user.displayName}</h3>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                                {user.address}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            {getRoleBadge(user.role)}
                            <div className="text-sm text-muted-foreground">Joined: {user.joinedDate}</div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/users/${user.id}`}>
                                  Manage User
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure global platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-bounty">Minimum Bounty Amount (USDC)</Label>
                      <Input id="min-bounty" type="number" defaultValue="50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                      <Input id="platform-fee" type="number" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audit-timeout">Audit Timeout (days)</Label>
                      <Input id="audit-timeout" type="number" defaultValue="7" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-auditors">Max Auditors Per Contract</Label>
                      <Input id="max-auditors" type="number" defaultValue="3" />
                    </div>
                  </div>
                  <Button className="mt-4">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Label component for the settings form
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
