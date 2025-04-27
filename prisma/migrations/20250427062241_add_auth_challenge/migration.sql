-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'auditor', 'admin');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('solidity', 'ink', 'rust');

-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('ethereum', 'bsc', 'polkadot', 'kusama', 'other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'in_progress', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('high', 'medium', 'low', 'info');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('DOT', 'USDC', 'ETH', 'USD');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('crypto', 'credit_card');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('DOT', 'USDC', 'ETH');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "wallet_address" TEXT NOT NULL,
    "display_name" TEXT,
    "email" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_earnings" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "reputation_score" INTEGER NOT NULL DEFAULT 0,
    "completed_audits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "contract_name" TEXT NOT NULL,
    "contract_address" TEXT,
    "contractType" "ContractType" NOT NULL,
    "chain" "Chain" NOT NULL,
    "bounty_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "bountyToken" "TokenType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "risk_score" INTEGER,
    "contract_code" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_findings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contract_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "code_snippet" TEXT,
    "recommendation" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_simulations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contract_id" UUID NOT NULL,
    "chain" TEXT NOT NULL,
    "deployment_cost" TEXT NOT NULL,
    "deployment_cost_usd" TEXT NOT NULL,
    "function_costs" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gas_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "transaction_hash" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_challenges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "wallet_address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "auth_challenges_wallet_address_key" ON "auth_challenges"("wallet_address");

-- AddForeignKey
ALTER TABLE "contract_submissions" ADD CONSTRAINT "contract_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_findings" ADD CONSTRAINT "audit_findings_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_simulations" ADD CONSTRAINT "gas_simulations_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
