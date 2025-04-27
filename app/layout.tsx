import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context" // Import AuthProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartAudit - Web3 Smart Contract Analysis",
  description: "Instant security & cost analysis for EVM and Polkadot-parachain smart contracts"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Keep suppressHydrationWarning on html tag
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* Wrap children with AuthProvider */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
