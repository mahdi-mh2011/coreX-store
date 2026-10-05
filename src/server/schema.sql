-- ============================================================================
-- PLUS SUBSCRIPTION SYSTEM: SQL DATABASE SCHEMA (PostgreSQL)
-- Currency: Iraqi Dinar (IQD / د.ع)
-- Specification:
--   - Monthly Plan: 2,000 IQD (renews every 30 days)
--   - Yearly Plan: 15,000 IQD (renews every 365 days)
--   - Daily Reward: 50 IQD every 24 hours (7-day expiration window)
--   - Ad-Free experience: subscription_status == 'active'
--   - Daily Transactions: Free <= 5/day; Plus = unconstrained
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    card_number VARCHAR(10) UNIQUE NOT NULL, -- 10-digit digital card number
    wallet_balance_iqd NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance_iqd >= 0),
    daily_purchase_count INT NOT NULL DEFAULT 0 CHECK (daily_purchase_count >= 0),
    last_purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_daily_reward_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for rapid lookups by email, card number, and daily quota checks
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_card_number ON users(card_number);
CREATE INDEX IF NOT EXISTS idx_users_daily_purchase ON users(last_purchase_date, daily_purchase_count);

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL DEFAULT 'plus', -- 'plus'
    subscription_type VARCHAR(50) NOT NULL DEFAULT 'monthly' CHECK (subscription_type IN ('monthly', 'yearly')),
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
    price_iqd NUMERIC(10, 2) NOT NULL CHECK (price_iqd IN (2000.00, 15000.00)),
    renews_every_days INT NOT NULL CHECK (renews_every_days IN (30, 365)),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired')),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    expiration_date TIMESTAMPTZ NOT NULL, -- Exact expiration timestamp
    cancellation_requested BOOLEAN NOT NULL DEFAULT FALSE, -- Tracks user-initiated cancellation
    cancellation_date TIMESTAMPTZ, -- Timestamp of cancellation request
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end, status);

-- ----------------------------------------------------------------------------
-- 3. DAILY REWARDS TABLE (50 IQD with 7-Day Expiration)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount_iqd NUMERIC(10, 2) NOT NULL DEFAULT 50.00 CHECK (amount_iqd = 50.00),
    disbursed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- disbursed_at + INTERVAL '7 days'
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'expired', 'used')),
    claimed_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_status ON daily_rewards(user_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_expiry ON daily_rewards(expires_at, status);

-- ----------------------------------------------------------------------------
-- 4. TRANSACTIONS AUDIT LEDGER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(40) NOT NULL CHECK (type IN (
        'subscription_fee',
        'daily_reward_disbursement',
        'daily_reward_expired_clawback',
        'product_purchase',
        'wallet_recharge',
        'peer_transfer'
    )),
    amount_iqd NUMERIC(14, 2) NOT NULL, -- positive for credits, negative for debits
    balance_after_iqd NUMERIC(14, 2) NOT NULL,
    reference_id VARCHAR(100),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 5. AUTOMATIC TIMESTAMP TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_modtime
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
