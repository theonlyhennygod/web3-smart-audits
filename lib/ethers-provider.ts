import { ethers, JsonRpcProvider } from 'ethers';

// Define the interface for the network configuration
interface NetworkConfig {
  name: string;
  rpc: string;
  chainId: number;
  blockExplorer: string;
}

// Configuration for Westend Asset Hub Testnet
export const WESTEND_ASSET_HUB_CONFIG: NetworkConfig = {
  name: 'Westend Asset Hub',
  rpc: 'https://westend-asset-hub-eth-rpc.polkadot.io', // Westend Asset Hub testnet RPC
  chainId: 1001, // Westend Asset Hub testnet chainId (Note: Tutorial had a different ID, using official one)
  blockExplorer: 'https://westend-asset-hub.subscan.io/',
};

// Function to get an Ethers.js Provider for Westend Asset Hub
export const getWestendAssetHubProvider = (): JsonRpcProvider => {
  return new JsonRpcProvider(WESTEND_ASSET_HUB_CONFIG.rpc, {
    chainId: WESTEND_ASSET_HUB_CONFIG.chainId,
    name: WESTEND_ASSET_HUB_CONFIG.name,
  });
};

// Helper to get a signer from a browser provider (e.g., MetaMask)
// Note: This requires the component using it to be client-side rendered ('use client')
export const getSigner = async (): Promise<ethers.Signer> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Use ethers.BrowserProvider for modern Ethers v6+
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return signer;
    } catch (error) {
      console.error("Error getting signer:", error);
      throw new Error('Failed to get signer from browser provider.');
    }
  }
  throw new Error('No Ethereum browser provider detected (e.g., MetaMask).');
};

// Example of creating a contract instance (replace with actual contract details when needed)
/*
import { Contract } from 'ethers';
import StorageABI from '../abis/Storage.json'; // Assuming ABI is stored here

const CONTRACT_ADDRESS = '0xabBd46Ef74b88E8B1CDa49BeFb5057710443Fd29'; // Example address

export const getStorageContract = (): Contract => {
  const provider = getWestendAssetHubProvider();
  return new Contract(CONTRACT_ADDRESS, StorageABI, provider);
};

export const getSignedStorageContract = async (): Promise<Contract> => {
  const signer = await getSigner();
  return new Contract(CONTRACT_ADDRESS, StorageABI, signer);
};
*/
