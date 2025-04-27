import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminPanel } from "./admin-panel"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">Manage contracts, bounties, and user permissions</p>
          <AdminPanel />
        </div>
      </main>
      <Footer />
    </div>
  )
}
