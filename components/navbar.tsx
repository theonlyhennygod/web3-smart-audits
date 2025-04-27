"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import dynamic from 'next/dynamic' // Import dynamic

// Dynamically import WalletConnect with SSR disabled using relative path
const WalletConnectDynamic = dynamic(
  () => import('./wallet-connect').then((mod) => mod.WalletConnect), // Changed to relative path
  { ssr: false, loading: () => <div className="h-9 w-24 rounded-md bg-muted animate-pulse" /> } // Added basic loading state
)

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard", // Changed href
      label: "Dashboard", // Changed label
      active: pathname === "/dashboard", // Updated active check
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      active: pathname === "/marketplace",
    },
    {
      href: "/analyze",
      label: "Analyze Contract", // Changed label
      active: pathname === "/analyze",
    },
  ]

  return (
    // Updated header styling for consistency
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-sm">
       {/* Removed justify-between, added gap */}
      <div className="container flex h-16 items-center gap-6">
         {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold gradient-text">SmartAudit</span>
          </Link>
        </div>
         {/* Centered Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-6"> {/* Added flex-1 and justify-center */}
          {routes.map((route) => (
            <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
         {/* Wallet Connect Section (Pushed to the right by flex-1 on nav) */}
        <div className="hidden md:flex items-center justify-end"> {/* Added justify-end */}
          <WalletConnectDynamic /> {/* Use dynamic component */}
        </div>
         {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <WalletConnectDynamic /> {/* Use dynamic component */}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
