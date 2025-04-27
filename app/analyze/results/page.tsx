import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalysisResults } from "./analysis-results"

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>
            <p className="text-muted-foreground mb-8">
              Here are the detailed results of your smart contract security and cost analysis.
            </p>
            <AnalysisResults />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
