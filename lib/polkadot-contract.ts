import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp'; // Removed InjectedExtension import
import { stringToHex, hexToU8a, u8aToHex } from '@polkadot/util'; // Import hex utilities
import type { WeightV2 } from '@polkadot/types/interfaces'; // Import WeightV2 type

// --- Configuration (Ensure these are in your .env file) ---
const nodeUrl = process.env.NEXT_PUBLIC_POLKADOT_NODE_URL; // Use NEXT_PUBLIC_ prefix for client-side access
const contractAddress = process.env.NEXT_PUBLIC_AUDIT_REGISTRY_CONTRACT_ADDRESS;
const contractAbiJson = process.env.NEXT_PUBLIC_AUDIT_REGISTRY_ABI; // ABI should be the JSON string content

let api: ApiPromise | null = null;
let contract: ContractPromise | null = null;

// --- Initialization ---
async function getApi(): Promise<ApiPromise> {
  if (api && api.isConnected) {
    return api;
  }
  if (!nodeUrl) {
    throw new Error("POLKADOT_NODE_URL is not set in environment variables.");
  }
  const provider = new WsProvider(nodeUrl);
  console.log(`Connecting to Polkadot node: ${nodeUrl}`);
  api = await ApiPromise.create({ provider });
  await api.isReady;
  console.log("Polkadot API connected.");
  return api;
}

async function getContract(): Promise<ContractPromise> {
  if (contract) {
    return contract;
  }
  if (!contractAddress || !contractAbiJson) {
    throw new Error("Contract address or ABI not set in environment variables.");
  }
  const apiInstance = await getApi();
  try {
    const abi = JSON.parse(contractAbiJson); // Parse the ABI JSON string
    contract = new ContractPromise(apiInstance, abi, contractAddress);
    console.log(`Contract loaded at address: ${contractAddress}`);
    return contract;
  } catch (error) {
     console.error("Failed to parse contract ABI JSON:", error);
     throw new Error("Invalid AUDIT_REGISTRY_ABI in environment variables.");
  }
}

// --- Contract Interaction ---

/**
 * Submits a submission ID (as a hash) to the AuditRegistry contract.
 * @param submissionId The UUID string from the database.
 * @param signerAddress The address of the user submitting.
 * @param source The source identifier of the wallet extension (e.g., 'subwallet-js', 'talisman').
 * @returns The transaction hash.
 */
export async function submitAuditRegistryEntry(
  submissionId: string,
  signerAddress: string,
  source: string // e.g., 'subwallet-js', 'talisman'
): Promise<string> {
  console.log(`Attempting to submit entry for ID: ${submissionId} by ${signerAddress} via ${source}`);
  const contractInstance = await getContract();
  const apiInstance = await getApi();

  // Get the injector for the signer's wallet
  const injector = await web3FromSource(source);
  if (!injector?.signer) {
    throw new Error(`Could not get signer from ${source} extension.`);
  }

  // Convert submissionId (UUID string) to a Hash (32 bytes)
  // Simplistic approach: hash the UUID string or pad/truncate hex representation
  // A robust solution might involve a better mapping or changing contract input type
  // For now, let's try hashing the hex representation and taking the first 32 bytes
  const submissionIdHex = stringToHex(submissionId); // Convert UUID string to hex
  const submissionIdBytes = hexToU8a(submissionIdHex);
  // Create a 32-byte hash - this is a placeholder conversion
  const contractHashInput = new Uint8Array(32);
  contractHashInput.set(submissionIdBytes.slice(0, 32)); // Take first 32 bytes (or pad if shorter)

  console.log(`Converted submissionId ${submissionId} to Hash input: ${u8aToHex(contractHashInput)}`);


  // Estimate gas - Provide large proofSize/refTime for estimation
  // Adjust these values based on chain specifics if needed, but large values usually work for estimation
   const gasLimit = apiInstance.registry.createType('WeightV2', {
      refTime: BigInt(100_000_000_000), // Large refTime value for estimation
      proofSize: BigInt(1_000_000),    // Large proofSize value for estimation
  }) as WeightV2; // Cast to WeightV2 type
  const value = 0; // No value transferred

  // Construct the transaction
  const tx = contractInstance.tx.submitContract(
    { value, gasLimit },
    contractHashInput // Pass the converted Hash
  );

  console.log("Transaction constructed, awaiting signature...");

  // Sign and send the transaction
  return new Promise((resolve, reject) => {
    tx.signAndSend(signerAddress, { signer: injector.signer }, ({ status, dispatchError, events = [] }) => {
      console.log(`Transaction status: ${status.type}`);

      if (status.isInBlock) {
        console.log(`Included in block: ${status.asInBlock}`);
      } else if (status.isFinalized) {
        console.log(`Finalized block hash: ${status.asFinalized}`);

        // Check for errors in the finalized transaction
        events.forEach(({ event: { data, method, section } }) => {
           console.log(`\tEvent: ${section}.${method}:: ${data.toString()}`);
           if (section === 'system' && method === 'ExtrinsicFailed') {
             const [dispatchError] = data as any; // Adjust type as needed based on API version
             if (dispatchError.isModule) {
               const decoded = apiInstance.registry.findMetaError(dispatchError.asModule);
               const { docs, name, section } = decoded;
               console.error(`Transaction Error: ${section}.${name}: ${docs.join(' ')}`);
               reject(new Error(`Transaction failed: ${section}.${name}`));
             } else {
               console.error(`Transaction Error: ${dispatchError.toString()}`);
               reject(new Error(`Transaction failed: ${dispatchError.toString()}`));
             }
           }
        });

        // If no ExtrinsicFailed event, assume success
        if (!events.some(e => e.event.section === 'system' && e.event.method === 'ExtrinsicFailed')) {
           console.log("Transaction successful.");
           resolve(tx.hash.toHex());
        }

      } else if (status.isDropped || status.isInvalid || status.isUsurped) {
         // Removed status.isError check as it's not valid
         console.error(`Transaction status: ${status.type}`);
         reject(new Error(`Transaction ${status.type}`));
      }
      // Handle other statuses as needed (e.g., Ready, Broadcast)
    }).catch((error: any) => {
      console.error('Error sending transaction:', error);
      reject(error);
    });
  });
}

// Optional: Function to disconnect API (e.g., on app close)
export async function disconnectApi() {
  if (api && api.isConnected) {
    await api.disconnect();
    api = null;
    contract = null;
    console.log("Polkadot API disconnected.");
  }
}
