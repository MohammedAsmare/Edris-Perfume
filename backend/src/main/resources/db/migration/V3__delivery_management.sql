-- V3: Delivery Partner, Delivery Assignment, Proof of Delivery, and Audit History

-- 1. Add ROLE_DELIVERY_PARTNER to seed users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, status, created_at, updated_at)
VALUES 
(4, 'delivery@edrisperfume.et', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Dawit', 'Haile', '+251944556677', 'ROLE_DELIVERY_PARTNER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 2. Delivery Partners table
CREATE TABLE IF NOT EXISTS delivery_partners (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    partner_name VARCHAR(150) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Motorcycle', -- Motorcycle, Van, Electric Scooter
    license_plate VARCHAR(50) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ON_DELIVERY, INACTIVE
    rating NUMERIC(3, 2) DEFAULT 5.0,
    active_deliveries_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Delivery Partners
INSERT INTO delivery_partners (id, user_id, partner_name, vehicle_type, license_plate, phone_number, status, rating, active_deliveries_count)
VALUES
(1, 4, 'Dawit Haile (Addis Swift Courier)', 'Motorcycle', 'ET-AA-3-98211', '+251944556677', 'ACTIVE', 4.95, 1)
ON CONFLICT (id) DO NOTHING;

-- 3. Enhance Orders table with delivery management fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_otp VARCHAR(10);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ready_pickup_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS closed_by_user_id BIGINT REFERENCES users(id);

-- 4. Delivery Assignments table
CREATE TABLE IF NOT EXISTS delivery_assignments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_partner_id BIGINT NOT NULL REFERENCES delivery_partners(id),
    merchant_id BIGINT REFERENCES merchant_profiles(id),
    assigned_by BIGINT REFERENCES users(id),
    status VARCHAR(40) NOT NULL DEFAULT 'ASSIGNED', -- ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED, CANCELLED
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_otp VARCHAR(10) NOT NULL, -- 6-digit confirmation PIN
    otp_attempts INT NOT NULL DEFAULT 0,
    max_otp_attempts INT NOT NULL DEFAULT 5,
    recipient_name VARCHAR(150),
    recipient_notes TEXT,
    proof_code VARCHAR(100),
    failure_reason TEXT,
    pickup_confirmed_at TIMESTAMP,
    started_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Audit & Status History table
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_order_status VARCHAR(40),
    to_order_status VARCHAR(40) NOT NULL,
    from_fulfillment_status VARCHAR(40),
    to_fulfillment_status VARCHAR(40) NOT NULL,
    action VARCHAR(80) NOT NULL,
    performed_by_id BIGINT REFERENCES users(id),
    performed_by_role VARCHAR(40) NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed an active assignment for Order #1
INSERT INTO delivery_assignments (
    id, order_id, delivery_partner_id, merchant_id, assigned_by, status, 
    pickup_address, delivery_address, delivery_otp, recipient_name, created_at, updated_at
)
VALUES (
    1, 1, 1, 1, 2, 'ASSIGNED',
    'Bole Medhanialem Mall, 2nd Floor, Addis Luxury Scents Boutique, Addis Ababa',
    'House 42, Near Edna Mall, Bole, Addis Ababa',
    '839214', 'Selamawit Tadesse', CURRENT_TIMESTAMP - INTERVAL '1 days', CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

UPDATE orders SET delivery_otp = '839214' WHERE id = 1;

-- Seed initial status history
INSERT INTO order_status_history (order_id, from_order_status, to_order_status, from_fulfillment_status, to_fulfillment_status, action, performed_by_id, performed_by_role, notes)
VALUES
(1, 'PENDING_PAYMENT', 'CONFIRMED', 'UNFULFILLED', 'PICKING', 'ORDER_ACCEPTED', 2, 'ROLE_MERCHANT', 'Order accepted and fragrant batch preparation initiated.'),
(1, 'CONFIRMED', 'CONFIRMED', 'PICKING', 'PACKED', 'MARKED_PACKED', 2, 'ROLE_MERCHANT', 'Luxury packaging and wax monogram sealing complete.'),
(1, 'CONFIRMED', 'CONFIRMED', 'PACKED', 'PACKED', 'DELIVERY_PARTNER_ASSIGNED', 2, 'ROLE_MERCHANT', 'Assigned Dawit Haile (Addis Swift Courier) with vehicle ET-AA-3-98211.')
ON CONFLICT DO NOTHING;
