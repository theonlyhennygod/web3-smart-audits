import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContractAnalyzer } from "./contract-analyzer"

export default function AnalyzePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Analyze Smart Contract</h1>
            <p className="text-muted-foreground mb-8">
              Upload your smart contract code or paste it directly to analyze for security vulnerabilities and cost
              optimization.
            </p>
            <ContractAnalyzer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
