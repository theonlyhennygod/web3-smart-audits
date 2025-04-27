import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Define paths relative to this config file (which is inside hardhat/)
const config: HardhatUserConfig = {
  solidity: "0.8.26", // Use a recent version
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    // Define testnets here later (e.g., sepolia)
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`]
    // }
  }
};

export default config;
