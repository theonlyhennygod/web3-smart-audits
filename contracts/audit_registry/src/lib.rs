#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod audit_registry {
    // Import necessary types
    use ink::prelude::vec::Vec; // Use ink's prelude for Vec
    use ink::storage::Mapping;
    // Define types if not already globally available in ink! environment
    // These might come from ink_env or primitives depending on ink! version
    // type AccountId = <ink::env::DefaultEnvironment as ink::env::Environment>::AccountId;
    // type Hash = <ink::env::DefaultEnvironment as ink::env::Environment>::Hash;


    #[ink(storage)]
    // Removed #[derive(Default)] as AccountId doesn't implement Default
    pub struct AuditRegistry {
        /// Stores a mapping from AccountId to a list of Hashes representing contract submissions.
        /// The Hash could represent the database ID or a hash of the contract code itself.
        submissions: Mapping<AccountId, Vec<Hash>>,
        /// Optional: Keep track of the owner for potential admin functions
        owner: AccountId,
    }

    // Manually implement Default since AccountId doesn't have one
    // This is primarily for initialization patterns, though our `new` handles it.
    // Note: This default implementation might not be practically usable if
    // the environment doesn't provide a default caller during default init.
    // However, it satisfies the clippy lint. Consider if a Default is truly needed.
    // If not, the lint can be suppressed with `#[allow(clippy::new_without_default)]`
    // above the `impl AuditRegistry` block. For now, we implement it.
    impl Default for AuditRegistry {
        fn default() -> Self {
            // This is problematic as Self::env().caller() might panic in a default context.
            // A better default might require an explicit default owner or different logic.
            // For now, mirroring `new` logic to satisfy clippy, but be aware.
             Self {
                 submissions: Default::default(),
                 // This line is the core issue for a *true* Default.
                 // We can't get a caller reliably here.
                 // Let's use a placeholder/zero address if possible, or reconsider Default need.
                 // For ink! 4+, AccountId might have a default zero address. Check docs.
                 // Assuming a zero-address default exists for demonstration:
                 owner: AccountId::from([0u8; 32]), // Placeholder/Zero address
            }
        }
    }


    /// Event emitted when a contract is submitted.
    #[ink(event)]
    pub struct ContractSubmitted {
        #[ink(topic)]
        submitter: AccountId,
        #[ink(topic)]
        contract_hash: Hash,
    }

    impl AuditRegistry {
        /// Constructor that initializes the `AuditRegistry` storage.
        /// Sets the caller as the owner.
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            // Initialize Mapping using Default derive
            // let submissions = Mapping::default(); // This is handled by #[derive(Default)] now
            Self {
                 submissions: Default::default(),
                 owner: caller,
            }
        }

        /// Submits a contract hash associated with the caller.
        #[ink(message)]
        pub fn submit_contract(&mut self, contract_hash: Hash) {
            let caller = self.env().caller();
            // Remove unnecessary borrow for caller
            let mut user_submissions = self.submissions.get(caller).unwrap_or_default();
            user_submissions.push(contract_hash);
            // Re-insert the updated vector into the mapping
            self.submissions.insert(caller, &user_submissions);

            // Emit an event
            self.env().emit_event(ContractSubmitted {
                submitter: caller,
                contract_hash,
            });
        }

        /// Retrieves the list of contract submission hashes for a given user.
        #[ink(message)]
        pub fn get_submissions(&self, user: AccountId) -> Vec<Hash> {
             // Remove unnecessary borrow for user
            self.submissions.get(user).unwrap_or_default()
        }

        /// Retrieves the owner of the contract.
        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        // --- Potential Future Functions ---
        // fn add_audit_result(&mut self, contract_hash: Hash, report_cid: Hash) { ... }
        // fn add_bounty(&mut self, contract_hash: Hash, amount: Balance) { ... }
        // fn claim_bounty(&mut self, contract_hash: Hash) { ... }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::{test, DefaultEnvironment}; // Import DefaultEnvironment for types

        fn default_accounts() -> test::DefaultAccounts<DefaultEnvironment> {
            test::default_accounts::<DefaultEnvironment>()
        }

        fn set_caller(caller: AccountId) {
            test::set_caller::<DefaultEnvironment>(caller);
        }

        #[ink::test]
        fn new_works() {
            let contract = AuditRegistry::new();
            let accounts = default_accounts();
            assert_eq!(contract.get_owner(), accounts.alice);
            assert_eq!(contract.get_submissions(accounts.alice).len(), 0);
        }

        #[ink::test]
        fn submit_contract_works() {
            let mut contract = AuditRegistry::new();
            let accounts = default_accounts();
            let sample_hash = Hash::from([0x01; 32]);

            set_caller(accounts.bob);
            contract.submit_contract(sample_hash);

            let bob_submissions = contract.get_submissions(accounts.bob);
            assert_eq!(bob_submissions.len(), 1);
            assert_eq!(bob_submissions[0], sample_hash);

            let alice_submissions = contract.get_submissions(accounts.alice);
            assert_eq!(alice_submissions.len(), 0);

             // Test submitting another hash
            let sample_hash_2 = Hash::from([0x02; 32]);
            contract.submit_contract(sample_hash_2);
            let bob_submissions_updated = contract.get_submissions(accounts.bob);
            assert_eq!(bob_submissions_updated.len(), 2);
            assert_eq!(bob_submissions_updated[1], sample_hash_2);
        }

         #[ink::test]
        fn get_submissions_works() {
             let mut contract = AuditRegistry::new();
            let accounts = default_accounts();
            let hash1 = Hash::from([0x11; 32]);
            let hash2 = Hash::from([0x22; 32]);

            set_caller(accounts.charlie);
            contract.submit_contract(hash1);
            contract.submit_contract(hash2);

            let charlie_submissions = contract.get_submissions(accounts.charlie);
            assert_eq!(charlie_submissions.len(), 2);
            assert!(charlie_submissions.contains(&hash1));
            assert!(charlie_submissions.contains(&hash2));

            let empty_submissions = contract.get_submissions(accounts.alice);
            assert_eq!(empty_submissions.len(), 0);
        }
    }
}
