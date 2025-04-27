import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Badge } from "@/components/ui/badge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ensure this is exported if used elsewhere
export const truncateAddress = (address: string): string => {
  if (!address || address.length < 11) return address // Handle undefined or short addresses
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Ensure this is exported if used elsewhere
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  // Added currency parameter with default
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency, // Use the provided currency
  }).format(amount)
}

// Ensure this is exported if used elsewhere
export const getRiskBadge = (score: number) => {
  // Removed explicit JSX.Element return type
  if (score >= 80) {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-500">
        High Risk
      </Badge>
    )
  }

  if (score >= 50) {
    return (
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
        Medium Risk
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-green-500/10 text-green-500">
      Low Risk
    </Badge>
  )
}
