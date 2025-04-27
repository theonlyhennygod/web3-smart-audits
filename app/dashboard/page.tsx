import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DashboardContent } from "./dashboard-content"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <DashboardContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
