-- Database schema for E-Wallet API
-- PostgreSQL DDL

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wallets table (one-to-one with users)
CREATE TABLE wallets (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Services table (Pulsa, Voucher Game, etc.)
CREATE TABLE services (
    service_code VARCHAR(50) PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_icon TEXT NOT NULL,
    service_tariff BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('TOPUP', 'PAYMENT')),
    service_code VARCHAR(50) NULL REFERENCES services(service_code),
    amount BIGINT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Banners table (for reference data)
CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);

-- Sample services data
INSERT INTO services (service_code, service_name, service_icon, service_tariff, category) VALUES
('PULSA_10K', 'Pulsa 10K', 'https://example.com/icons/pulsa-10k.png', 10000, 'PULSA'),
('PULSA_20K', 'Pulsa 20K', 'https://example.com/icons/pulsa-20k.png', 20000, 'PULSA'),
('PULSA_50K', 'Pulsa 50K', 'https://example.com/icons/pulsa-50k.png', 50000, 'PULSA'),
('PULSA_100K', 'Pulsa 100K', 'https://example.com/icons/pulsa-100k.png', 100000, 'PULSA'),
('VOUCHER_GAME_10K', 'Voucher Game 10K', 'https://example.com/icons/voucher-10k.png', 10000, 'VOUCHER_GAME'),
('VOUCHER_GAME_25K', 'Voucher Game 25K', 'https://example.com/icons/voucher-25k.png', 25000, 'VOUCHER_GAME');
('VOUCHER_GAME_50K', 'Voucher Game 50K', 'https://example.com/icons/voucher-50k.png', 50000, 'VOUCHER_GAME');
('VOUCHER_GAME_100K', 'Voucher Game 100K', 'https://example.com/icons/voucher-100k.png', 100000, 'VOUCHER_GAME');


-- Sample banners data
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Promo Pulsa', 'https://example.com/banners/promo-pulsa.jpg', 'Dapatkan cashback untuk pembelian pulsa'),
('Voucher Game Sale', 'https://example.com/banners/voucher-sale.jpg', 'Diskon voucher game hingga 20%'),
('Promo Voucher Game', 'https://example.com/banners/promo-voucher-game.jpg', 'Dapatkan diskon voucher game hingga 30%');