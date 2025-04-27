import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarketplaceContent } from "./marketplace-content"

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Contract Marketplace</h1>
          <p className="text-muted-foreground mb-8">
            Browse contracts available for audit, filter by bounty amount, or submit your own contract for analysis.
          </p>
          <MarketplaceContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
