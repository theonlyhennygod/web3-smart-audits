"use client"

import React, { useState, useEffect } from "react" // Ensure React is imported for React.ReactNode
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, LogOut, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation" // Re-added useRouter as it's used in disconnect
import { truncateAddress } from "@/lib/utils" // Use alias path
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { u8aToHex, stringToU8a } from '@polkadot/util';
import { MetaMaskInpageProvider } from '@metamask/providers'
import { ethers } from "ethers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils" // Import cn for conditional classes
import { useAuth } from "@/context/auth-context" // Import the useAuth hook

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

// Helper component for the inline SVG
const MetaMaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 212 189" className="h-6 w-6"> {/* Adjusted size */}
    <g fill="none" fillRule="evenodd">
      <polygon fill="#CDBDB2" points="60.75 173.25 88.313 180.563 88.313 171 90.563 168.75 106.313 168.75 106.313 180 106.313 187.875 89.438 187.875 68.625 178.875"></polygon>
      <polygon fill="#CDBDB2" points="105.75 173.25 132.75 180.563 132.75 171 135 168.75 150.75 168.75 150.75 180 150.75 187.875 133.875 187.875 113.063 178.875" transform="matrix(-1 0 0 1 256.5 0)"></polygon>
      <polygon fill="#393939" points="90.563 152.438 88.313 171 91.125 168.75 120.375 168.75 123.75 171 121.5 152.438 117 149.625 94.5 150.188"></polygon>
      <polygon fill="#F89C35" points="75.375 27 88.875 58.5 95.063 150.188 117 150.188 123.75 58.5 136.125 27"></polygon>
      <polygon fill="#F89D35" points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"></polygon>
      <polygon fill="#D87C30" points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"></polygon>
      <polygon fill="#EA8D3A" points="46.125 101.813 65.25 119.813 65.25 137.813"></polygon>
      <polygon fill="#F89D35" points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"></polygon>
      <polygon fill="#EB8F35" points="65.25 138.375 60.75 173.25 90 153"></polygon>
      <polygon fill="#EA8E3A" points="92.25 102.375 95.063 150.188 86.625 125.719"></polygon>
      <polygon fill="#D87C30" points="39.375 138.938 65.25 138.375 60.75 173.25"></polygon>
      <polygon fill="#EB8F35" points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"></polygon>
      <polygon fill="#E8821E" points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"></polygon>
      <polygon fill="#DFCEC3" points="60.75 173.25 90.563 152.438 88.313 170.438 88.313 180.563 68.063 176.625"></polygon>
      <polygon fill="#DFCEC3" points="121.5 173.25 150.75 152.438 148.5 170.438 148.5 180.563 128.25 176.625" transform="matrix(-1 0 0 1 272.25 0)"></polygon>
      <polygon fill="#393939" points="70.313 112.5 64.125 125.438 86.063 119.813" transform="matrix(-1 0 0 1 150.188 0)"></polygon>
      <polygon fill="#E88F35" points="12.375 .563 88.875 58.5 75.938 27"></polygon>
      <path fill="#8E5A30" d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"></path>
      <g transform="matrix(-1 0 0 1 211.5 0)">
        <polygon fill="#F89D35" points="16.313 96.188 .563 141.75 39.938 139.5 65.25 139.5 65.25 119.813 64.125 79.313 58.5 83.813"></polygon>
        <polygon fill="#D87C30" points="46.125 101.25 92.25 102.375 87.188 126 65.25 120.375"></polygon>
        <polygon fill="#EA8D3A" points="46.125 101.813 65.25 119.813 65.25 137.813"></polygon>
        <polygon fill="#F89D35" points="65.25 120.375 87.75 126 95.063 150.188 90 153 65.25 138.375"></polygon>
        <polygon fill="#EB8F35" points="65.25 138.375 60.75 173.25 90 153"></polygon>
        <polygon fill="#EA8E3A" points="92.25 102.375 95.063 150.188 86.625 125.719"></polygon>
        <polygon fill="#D87C30" points="39.375 138.938 65.25 138.375 60.75 173.25"></polygon>
        <polygon fill="#EB8F35" points="12.938 188.438 60.75 173.25 39.375 138.938 .563 141.75"></polygon>
        <polygon fill="#E8821E" points="88.875 58.5 64.688 78.75 46.125 101.25 92.25 102.938"></polygon>
        <polygon fill="#393939" points="70.313 112.5 64.125 125.438 86.063 119.813" transform="matrix(-1 0 0 1 150.188 0)"></polygon>
        <polygon fill="#E88F35" points="12.375 .563 88.875 58.5 75.938 27"></polygon>
        <path fill="#8E5A30" d="M12.3750002,0.562500008 L2.25000003,31.5000005 L7.87500012,65.250001 L3.93750006,67.500001 L9.56250014,72.5625 L5.06250008,76.5000011 L11.25,82.1250012 L7.31250011,85.5000013 L16.3125002,96.7500014 L58.5000009,83.8125012 C79.1250012,67.3125004 89.2500013,58.8750003 88.8750013,58.5000009 C88.5000013,58.1250009 63.0000009,38.8125006 12.3750002,0.562500008 Z"></path>
      </g>
    </g>
  </svg>
);

type WalletConfig = {
  id: string
  name: string
  network: 'ethereum' | 'polkadot'
  connector: () => Promise<string> // Gets the address
  signer: (address: string, message: string) => Promise<string> // Signs a message
  icon?: string // Make icon path optional
  iconComponent?: React.ReactNode // Use React.ReactNode instead of JSX.Element
}

const networks: ReadonlyArray<{
  id: string
  name: string
  wallets: ReadonlyArray<WalletConfig>
}> = [
  {
    id: 'ethereum',
    name: 'EVM Chains',
    wallets: [
      {
        id: 'metamask',
        name: 'MetaMask',
        network: 'ethereum',
        connector: async () => {
          if (!window.ethereum) throw new Error('MetaMask not installed')
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
          if (!accounts || accounts.length === 0) throw new Error('No MetaMask accounts found')
          return accounts[0]
        },
        signer: async (address: string, message: string) => {
          if (!window.ethereum) throw new Error('MetaMask not installed')
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [ethers.hexlify(ethers.toUtf8Bytes(message)), address],
          })
          return signature as string
        },
        iconComponent: <MetaMaskIcon />,
      },
      {
        id: 'rainbow',
        name: 'Rainbow',
        network: 'ethereum',
        connector: async () => {
          if (!window.ethereum) throw new Error('EVM Wallet (like Rainbow) not installed')
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
          if (!accounts || accounts.length === 0) throw new Error('No Rainbow accounts found')
          return accounts[0]
        },
        signer: async (address: string, message: string) => {
          if (!window.ethereum) throw new Error('EVM Wallet (like Rainbow) not installed')
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [ethers.hexlify(ethers.toUtf8Bytes(message)), address],
          })
          return signature as string
        },
        icon: '/rainbow.png'
      }
    ]
  },
  {
    id: 'polkadot',
    name: 'Polkadot Ecosystem',
    wallets: [
      {
        id: 'subwallet-js',
        name: 'SubWallet',
        network: 'polkadot',
        connector: async () => {
          const extensions = await web3Enable('SmartAudit');
          if (extensions.length === 0) throw new Error('SubWallet extension not found');
          const accounts = await web3Accounts();
          if (accounts.length === 0) throw new Error('No Polkadot accounts found');
          const subwalletAccount = accounts.find(a => a.meta.source === 'subwallet-js');
          if (!subwalletAccount) throw new Error('SubWallet account not found');
          return subwalletAccount.address;
        },
        signer: async (address: string, message: string) => {
          const injector = await web3FromSource('subwallet-js');
          if (!injector?.signer?.signRaw) throw new Error('signRaw not available on SubWallet injector');
          const { signature } = await injector.signer.signRaw({
            address,
            data: u8aToHex(stringToU8a(message)),
            type: 'bytes'
          });
          return signature;
        },
        icon: '/subwallet.svg'
      },
      {
        id: 'talisman',
        name: 'Talisman',
        network: 'polkadot',
        connector: async () => {
          const extensions = await web3Enable('SmartAudit');
          if (extensions.length === 0) throw new Error('Talisman extension not found');
          const accounts = await web3Accounts();
          const talismanAccount = accounts.find(a => a.meta.source === 'talisman');
          if (!talismanAccount) throw new Error('Talisman account not found');
          return talismanAccount.address;
        },
        signer: async (address: string, message: string) => {
          const injector = await web3FromSource('talisman');
          if (!injector?.signer?.signRaw) throw new Error('signRaw not available on Talisman injector');
          const { signature } = await injector.signer.signRaw({
            address,
            data: u8aToHex(stringToU8a(message)),
            type: 'bytes'
          });
          return signature;
        },
        icon: '/talisman.svg'
      }
    ]
  }
] as const

// Combine all wallets into a single list
const allWallets = networks.flatMap(network => network.wallets);

export function WalletConnect() {
  const { user, isLoading: isLoadingSession, error: authError, login, logout, clearError } = useAuth(); // Use context
  const [isOpen, setIsOpen] = useState(false); // Keep dialog open state local
  const [isConnecting, setIsConnecting] = useState(false); // Keep connection loading state local
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null); // Track which wallet is connecting
  const [localError, setLocalError] = useState<string | null>(null); // Local error for connection process

  // Clear local error when auth error changes or dialog opens/closes
  useEffect(() => {
    setLocalError(authError); // Sync local error with auth context error initially
  }, [authError]);

  useEffect(() => {
    if (!isOpen) {
      setLocalError(null); // Clear local error when dialog closes
      clearError(); // Clear global error as well
    }
  }, [isOpen, clearError]);


  const connectWallet = async (wallet: WalletConfig) => {
    setIsConnecting(true);
    setConnectingWalletId(wallet.id); // Set the ID of the wallet being connected
    setLocalError(null); // Clear previous local errors
    clearError(); // Clear previous global errors
    let success = false; // Flag to track if connection succeeded
    try {
      // 1. Get wallet address
      const address = await wallet.connector()
      if (!address) throw new Error("Could not get wallet address.")

      // 2. Get challenge nonce from backend
      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      })
      if (!challengeResponse.ok) {
        const errorData = await challengeResponse.json()
        throw new Error(errorData.error || "Failed to get challenge")
      }
      const { nonce } = await challengeResponse.json()
      if (!nonce) throw new Error("Invalid challenge received")

      // 3. Prompt user to sign the nonce
      const signature = await wallet.signer(address, `Please sign this message to log in: ${nonce}`)
      if (!signature) throw new Error("Signing failed or was cancelled.")

      // 4. Send address, nonce, and signature to backend for verification
      const signinResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, signature, nonce, network: wallet.network }),
      })

      if (!signinResponse.ok) {
        const errorData = await signinResponse.json()
        throw new Error(errorData.error || "Authentication failed")
      }

      const { user: userData } = await signinResponse.json()

      // Call login from context to update global state
      login({
        name: userData.displayName || wallet.name,
        address: userData.walletAddress,
        network: wallet.network
      });
      success = true; // Mark as success

    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setLocalError(err.message || "An unknown error occurred"); // Set local error state
    } finally {
      setIsConnecting(false); // Stop loading indicator
      setConnectingWalletId(null); // Clear the specific connecting wallet ID
      // Close dialog only on success
      if (success) {
        setIsOpen(false);
      }
    }
  }

  // Render loading state for session check
  if (isLoadingSession) {
     return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Loading...</span>
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
     );
  }

  return (
    <>
      {/* Connected State Display (uses global user state) */}
      <div className={cn("flex items-center gap-2", !user && "hidden")}>
        {user && (
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span>{truncateAddress(user.address)}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}> {/* Use logout from context */}
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Disconnected State / Dialog Trigger */}
      {/* Use conditional rendering for the Dialog trigger based on global user state */}
      {!user && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent className="bg-background/80 backdrop-blur-sm border-border/50">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Connect your wallet to access the platform.
              </DialogDescription>
            </DialogHeader>
            {/* Always show the list of wallets */}
            <div className="space-y-4 mt-4">
              {allWallets.map(wallet => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => connectWallet(wallet)}
                  disabled={isConnecting} // Keep button disabled while connecting
                >
                  {/* Show spinner only if this specific button is connecting */}
                  {isConnecting && connectingWalletId === wallet.id ? (
                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   ) : (
                     wallet.iconComponent ? wallet.iconComponent : (
                       <img
                         src={wallet.icon}
                         alt={wallet.name}
                         className="h-6 w-6 rounded-full"
                       />
                     )
                   )}
                  <span>{wallet.name}</span>
                </Button>
              ))}
            </div>
            {/* Use localError for dialog-specific errors */}
            {localError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
