"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react" // Removed CreditCard
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { SlideIn } from "@/components/animations/slide-in"
import { submitAuditRegistryEntry } from "../../../lib/polkadot-contract"; // Corrected relative path
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Import RadioGroup

// Define costs
const COSTS = {
  eth: { amount: 0.01, symbol: "ETH", usdEquivalent: 25 },
  dot: { amount: 0.5, symbol: "DOT", usdEquivalent: 25 }, // Assuming DOT cost is equivalent for now
};

export function PaymentForm() {
  // Removed activeTab state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Removed Credit card form state

  // Crypto form state - default to ETH
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState<"eth" | "dot">("eth") // Type restricted to eth/dot

  const handleSubmit = async () => {
    setError("")

    // Simplified validation for crypto only
    if (!walletAddress) {
      setError("Please enter your wallet address")
      return
    }

    setIsLoading(true)
    setIsProcessing(true)

    // Simulate payment processing & On-chain submission
    const placeholderSubmissionId = "placeholder-uuid-" + Date.now(); // Replace with actual ID
    const placeholderSignerAddress = walletAddress || "5FakeAddress..."; // Replace with actual connected address
    const placeholderSource = "subwallet-js"; // Replace with actual connected wallet source

    try {
      // Simulate backend payment processing first
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate backend call

      // If DOT payment, attempt on-chain submission
      if (selectedCrypto === 'dot') {
        console.log("Attempting on-chain submission to AuditRegistry...");
        // Call the on-chain function AFTER simulated payment success
        const txHash = await submitAuditRegistryEntry(
          placeholderSubmissionId,
          placeholderSignerAddress,
          placeholderSource
        );
        console.log("AuditRegistry submission successful, Tx Hash:", txHash);
        // TODO: Potentially save txHash to DB associated with payment/submission
      } else {
         console.log(`Simulating ${selectedCrypto.toUpperCase()} payment. Skipping on-chain DOT submission.`);
         // TODO: Implement actual ETH payment logic if needed
      }

       // Simulate remaining processing time
       await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to results page on success
      window.location.href = "/analyze/results" // Consider using Next.js router.push for client-side navigation

    } catch (onChainError: any) {
       console.error("On-chain submission failed:", onChainError);
       setError(`Failed to record submission on-chain: ${onChainError.message}`);
       // Stop processing animation only on error, success leads to redirect
       setIsProcessing(false);
       setIsLoading(false);
    }
    // Removed finally block as redirect handles success case
  }

  const currentCost = COSTS[selectedCrypto];

  return (
    <FadeIn>
      <Card className="w-full border-border hover:border-secondary/50 transition-colors">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Select your cryptocurrency to pay the analysis fee.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Removed Tabs */}
          <div className="space-y-6">
            <SlideIn direction="up">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Icon could be dynamic based on selectedCrypto */}
                  <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="font-bold text-xl">{selectedCrypto === 'eth' ? 'Ξ' : '●'}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Smart Contract Analysis</h3>
                    <p className="text-sm text-muted-foreground">One-time fee</p>
                  </div>
                </div>
                <div className="text-right">
                   {/* Dynamic Cost Display */}
                  <p className="font-bold">{currentCost.amount} {currentCost.symbol}</p>
                  <p className="text-sm text-muted-foreground">≈ ${currentCost.usdEquivalent} USD</p>
                </div>
              </div>
            </SlideIn>

            <div className="space-y-4">
              {/* Radio Group for ETH/DOT selection */}
              <RadioGroup
                defaultValue="eth"
                value={selectedCrypto}
                onValueChange={(value: "eth" | "dot") => setSelectedCrypto(value)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="eth" id="eth" className="peer sr-only" />
                  <Label
                    htmlFor="eth"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="font-bold text-2xl mb-2">Ξ</span>
                    Ethereum (ETH)
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dot" id="dot" className="peer sr-only" />
                  <Label
                    htmlFor="dot"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                     <span className="font-bold text-2xl mb-2">●</span>
                     Polkadot (DOT)
                  </Label>
                </div>
              </RadioGroup>

              {/* Removed Amount Input */}

              <div>
                <Label htmlFor="wallet-address">Your Wallet Address (For {selectedCrypto.toUpperCase()})</Label>
                <Input
                  id="wallet-address"
                  placeholder={selectedCrypto === 'eth' ? "0x..." : "5..."}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                 <p className="text-xs text-muted-foreground mt-1">
                    Ensure this is the correct address for the selected network.
                 </p>
              </div>

              <Alert className="bg-muted">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Instructions</AlertTitle>
                <AlertDescription>
                  After clicking "Process Payment", you will be prompted by your connected wallet (if applicable for {selectedCrypto.toUpperCase()}) to confirm the
                  transaction. This is currently running on testnet for demonstration purposes.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          {/* Removed Credit Card TabsContent */}

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isProcessing && (
             // Simplified Processing Indicator
            <div className="mt-6 p-4 bg-muted/30 rounded-lg flex flex-col items-center justify-center text-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
               <p className="text-sm font-medium">Processing Payment...</p>
               <p className="text-xs text-muted-foreground">Please wait and confirm in your wallet if prompted.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full group" onClick={handleSubmit} disabled={isLoading || isProcessing}>
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isProcessing ? 'Processing...' : 'Initiating...'}
              </span>
            ) : (
              <span className="flex items-center">
                Process Payment ({currentCost.amount} {currentCost.symbol})
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </FadeIn>
  )
}
