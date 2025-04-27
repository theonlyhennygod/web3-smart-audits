import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PaymentForm } from "./payment-form"

export default function PaymentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Payment</h1>
            <p className="text-muted-foreground mb-8">
              Choose your preferred payment method to proceed with the smart contract analysis.
            </p>
            <PaymentForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
