CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    star_amount INTEGER NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_username ON orders(username);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
