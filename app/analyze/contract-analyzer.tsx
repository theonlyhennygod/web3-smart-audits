"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowRight, FileCode, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { SlideIn } from "@/components/animations/slide-in"

export function ContractAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload")
  const [contractCode, setContractCode] = useState("")
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [contractType, setContractType] = useState("solidity")
  const [contractAddress, setContractAddress] = useState("")
  const [addressTab, setAddressTab] = useState("upload")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [addBounty, setAddBounty] = useState(false)
  const [bountyAmount, setBountyAmount] = useState("0")
  const [bountyToken, setBountyToken] = useState("USDC")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setContractFile(file)
      setError("")
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContractCode(e.target.value)
    setError("")
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(e.target.value)
    setError("")
  }

  const handleSubmit = async () => {
    setError("")

    if (addressTab === "address" && !contractAddress) {
      setError("Please enter a contract address")
      return
    }

    if (addressTab === "upload") {
      if (activeTab === "upload" && !contractFile) {
        setError("Please upload a contract file")
        return
      }

      if (activeTab === "paste" && !contractCode.trim()) {
        setError("Please enter your contract code")
        return
      }
    }

    if (addBounty && (Number.parseFloat(bountyAmount) <= 0 || isNaN(Number.parseFloat(bountyAmount)))) {
      setError("Please enter a valid bounty amount")
      return
    }

    setIsLoading(true)
    setIsAnalyzing(true)

    // Simulate API call with a more realistic analysis animation
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to payment page
      window.location.href = "/analyze/payment"
    }, 3000)
  }

  return (
    <FadeIn>
      <Card className="w-full border-border hover:border-secondary/50 transition-colors">
        <CardHeader>
          <CardTitle>Submit Your Contract</CardTitle>
          <CardDescription>
            Upload, paste your smart contract code, or enter a contract address for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" value={addressTab} onValueChange={setAddressTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload">Upload/Paste Code</TabsTrigger>
              <TabsTrigger value="address">Contract Address</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="paste">Paste Code</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <div className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="contract-file">Contract File</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer hover:border-secondary/50">
                        <Input
                          id="contract-file"
                          type="file"
                          className="hidden"
                          accept=".sol,.rs,.ink"
                          onChange={handleFileChange}
                        />
                        <Label htmlFor="contract-file" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                            >
                              <Upload className="h-8 w-8 text-muted-foreground" />
                            </motion.div>
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-medium">
                                {contractFile ? contractFile.name : "Click to upload or drag and drop"}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Supports Solidity (.sol), Rust (.rs), and ink! (.ink) files
                              </span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="paste">
                  <div className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="contract-code">Contract Code</Label>
                      <Textarea
                        id="contract-code"
                        placeholder="Paste your smart contract code here..."
                        className="min-h-[300px] font-mono"
                        value={contractCode}
                        onChange={handleCodeChange}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="address">
              <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="contract-address">Contract Address</Label>
                  <Input
                    id="contract-address"
                    placeholder="0x... or 5..."
                    value={contractAddress}
                    onChange={handleAddressChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the deployed contract address on Ethereum, BSC, or Polkadot
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid w-full gap-1.5 mt-6">
            <Label htmlFor="contract-type">Contract Type</Label>
            <Select value={contractType} onValueChange={setContractType}>
              <SelectTrigger id="contract-type">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solidity">Solidity (EVM)</SelectItem>
                <SelectItem value="ink">ink! (Polkadot)</SelectItem>
                <SelectItem value="rust">Rust (Substrate)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Switch id="add-bounty" checked={addBounty} onCheckedChange={setAddBounty} />
            <Label htmlFor="add-bounty">Add bounty for auditors</Label>
          </div>

          {addBounty && (
            <SlideIn direction="down" className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="bounty-amount">Bounty Amount</Label>
                <Input
                  id="bounty-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={bountyAmount}
                  onChange={(e) => setBountyAmount(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="bounty-token">Token</Label>
                <Select value={bountyToken} onValueChange={setBountyToken}>
                  <SelectTrigger id="bounty-token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="DOT">DOT</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SlideIn>
          )}

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAnalyzing && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium mb-2">Analyzing Contract</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI is scanning your contract for vulnerabilities and optimization opportunities
                  </p>
                </div>
                <div className="w-full max-w-md h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary via-primary to-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex space-x-2 mb-2">
                    <motion.div
                      className="h-2 w-2 rounded-full bg-secondary"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                    />
                    <motion.div
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                    />
                    <motion.div
                      className="h-2 w-2 rounded-full bg-accent"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                    />
                  </div>
                  <motion.div
                    className="text-xs text-muted-foreground"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    <span className="font-mono">Scanning for vulnerabilities...</span>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full group" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <FileCode className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </FadeIn>
  )
}
