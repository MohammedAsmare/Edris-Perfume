-- Edris Perfume Seed Data
-- Users: Passwords are encrypted with BCrypt (Password: 'Edris@123456')
-- BCrypt hash for 'Edris@123456': $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi

INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, status, created_at, updated_at)
VALUES 
(1, 'admin@edrisperfume.et', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Edris', 'Administrator', '+251911223344', 'ROLE_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'merchant@edrisperfume.et', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Abebe', 'Kebede', '+251922334455', 'ROLE_MERCHANT', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'customer@edrisperfume.et', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Selamawit', 'Tadesse', '+251933445566', 'ROLE_CUSTOMER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Merchant Profile for Abebe (Approved)
INSERT INTO merchant_profiles (id, user_id, business_name, tin_number, trade_license_number, contact_phone, address, bank_name, bank_account_number, bank_account_name, approval_status, commission_rate, created_at, updated_at)
VALUES 
(1, 2, 'Addis Luxury Scents Boutique', '0012345678', 'TL-AA-2024-9881', '+251922334455', 'Bole Medhanialem Mall, 2nd Floor, Addis Ababa', 'Commercial Bank of Ethiopia', '1000123456789', 'Addis Luxury Scents LLC', 'APPROVED', 10.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
(1, 'Extrait de Parfum', 'extrait-de-parfum', 'The highest concentration of precious aromatic compounds for sublime projection and all-day sillage.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', 1, TRUE),
(2, 'Eau de Parfum', 'eau-de-parfum', 'Sophisticated everyday luxury with long-lasting depth and radiant notes.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800', 2, TRUE),
(3, 'Oriental & Oud', 'oriental-oud', 'Sumptuous incense, Ethiopian frankincense, rare agarwood, and honeyed amber.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800', 3, TRUE),
(4, 'Floral & Romantic', 'floral-romantic', 'Velvety Damascena rose, jasmine sambac, and delicate powdery blossoms.', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800', 4, TRUE),
(5, 'Woody & Smoky', 'woody-smoky', 'Dry cedarwood, smoky vetiver, rich patchouli, and sacred woods.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800', 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Brands
INSERT INTO brands (id, name, slug, description, logo_url, is_featured, is_active)
VALUES
(1, 'Edris Signature', 'edris-signature', 'Exclusive haute perfumery crafted in small batches blending heritage Ethiopian botanicals with Grasse mastery.', 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=400', TRUE, TRUE),
(2, 'Amouage', 'amouage', 'The Gift of Kings — opulence, rare frankincense, and majestic Middle Eastern craftsmanship.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400', TRUE, TRUE),
(3, 'Xerjoff', 'xerjoff', 'Italian artistic luxury combining nature’s rarest ingredients with hand-carved Murano-style glass.', 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=400', TRUE, TRUE),
(4, 'Maison Francis Kurkdjian', 'maison-francis-kurkdjian', 'Parisian olfactory poetry offering luminescent, crystalline elegance.', 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=400', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, merchant_id, category_id, brand_id, name, slug, short_description, full_description, fragrance_family, volume_ml, concentration, top_notes, heart_notes, base_notes, price, compare_at_price, sku, stock_quantity, low_stock_threshold, is_featured, is_active, rating_avg, review_count, created_at, updated_at)
VALUES
(1, 1, 1, 1, 'Edris Royale Extrait', 'edris-royale-extrait', 'Majestic blend of rare Tigray frankincense, saffron, bourbon vanilla, and golden amber.', 'Edris Royale Extrait is our crown jewel fragrance. Sourced from the ancient mountain resin groves of Ethiopia and combined with refined French perfumery, this extrait delivers exceptional longevity exceeding 24 hours with a regal sillage.', 'Oriental', 100, 'Extrait de Parfum', 'Saffron, Bergamot, Pink Pepper', 'Ethiopian Frankincense, Jasmine, Damask Rose', 'Bourbon Vanilla, Agarwood, Ambergris, Sandalwood', 14500.00, 16800.00, 'EDR-ROY-100', 45, 5, TRUE, TRUE, 5.0, 38, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 1, 3, 1, 'Addis Nights Oud', 'addis-nights-oud', 'Deep smoky oud infused with spiced cardamom, dark roasted coffee blossom, and tobacco leaf.', 'Inspired by the vibrant, cool starlit evenings of Addis Ababa. Rich woody tones meet the warmth of traditional spiced coffee ceremonies, wrapped in velvet suede.', 'Woody & Smoky', 100, 'Eau de Parfum', 'Cardamom, Cinnamon, Bitter Orange', 'Coffee Blossom, Birch Tar, Nutmeg', 'Cambodian Oud, Cedarwood, Leather, Benzoin', 12800.00, 14000.00, 'EDR-ADD-100', 30, 5, TRUE, TRUE, 4.9, 24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 1, 4, 1, 'Lalibela Golden Rose', 'lalibela-golden-rose', 'A divine celestial bouquet of honeyed roses, white myrrh, and warm cashmeran.', 'A spiritual tribute to the rock-hewn majesty of Lalibela. Sun-drenched roses kissed by sweet dew and consecrated myrrh create an ethereal, angelic presence.', 'Floral & Romantic', 100, 'Eau de Parfum', 'Lychee, Mandarin, Morning Dew', 'Taif Rose, Red Bulgarian Rose, Peony', 'White Myrrh, Cashmere Wood, White Musk', 11200.00, NULL, 'EDR-LAL-100', 25, 4, TRUE, TRUE, 4.8, 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 1, 2, 2, 'Amouage Interlude Black Iris', 'amouage-interlude-black-iris', 'A complex palette of bergamot, rosemary, violet leaves with iris, amber, and frankincense.', 'Interlude Black Iris evokes an air of disorder while maintaining a sense of balance and tranquility through the inventive use of orris, frankincense, and myrrh.', 'Oriental', 100, 'Eau de Parfum', 'Bergamot, Rosemary, Violet Leaves', 'Orris, Amber, Frankincense, Cistus', 'Leather, Agarwood Smoke, Patchouli, Sandalwood', 24500.00, 27000.00, 'AMU-INT-100', 12, 3, TRUE, TRUE, 4.95, 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 1, 1, 3, 'Xerjoff Naxos 1861', 'xerjoff-naxos-1861', 'Sun-drenched Mediterranean citrus with sweet honey, lavender, and sensual tobacco.', 'Celebrates the deep and sensual heart of Sicily with a joyful Mediterranean character. Honeyed warmth harmonizes with aristocratic tobacco notes.', 'Gourmand Oriental', 100, 'Eau de Parfum', 'Bergamot, Lemon, Lavender', 'Honey, Cinnamon, Cashmeran, Jasmine Sambac', 'Tobacco Leaf, Tonka Bean, Vanilla', 21800.00, 23500.00, 'XRJ-NAX-100', 18, 4, TRUE, TRUE, 5.0, 51, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 1, 1, 4, 'Baccarat Rouge 540 Extrait', 'baccarat-rouge-540-extrait', 'Luminous grandiflorum jasmine, saffron, bitter almond, and ambergris cedar accord.', 'The pinnacle of French perfumery by Francis Kurkdjian. Highly condensed intensity that radiates like crystal spun into gold under candlelight.', 'Amber Floral', 70, 'Extrait de Parfum', 'Bitter Almond, Saffron', 'Egyptian Jasmine Grandiflorum, Cedar', 'Ambergris, Woody Musk', 28500.00, NULL, 'MFK-BR540-70', 8, 2, TRUE, TRUE, 4.98, 89, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Product Images
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES
(1, 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800', TRUE, 1)
ON CONFLICT DO NOTHING;

-- Payment Methods
INSERT INTO payment_methods (id, code, name, description, provider_type, is_active, display_order)
VALUES
(1, 'TELEBIRR', 'Telebirr SuperApp', 'Instant automated mobile payment via Ethio Telecom Telebirr. Seamless checkout.', 'TELEBIRR', TRUE, 1),
(2, 'CBE_BIRR', 'CBE Birr', 'Direct payment using your Commercial Bank of Ethiopia CBE Birr mobile wallet.', 'TELEBIRR', TRUE, 2),
(3, 'BANK_TRANSFER_CBE', 'CBE Bank Transfer', 'Commercial Bank of Ethiopia (CBE) direct account transfer or mobile banking deposit.', 'BANK_TRANSFER', TRUE, 3),
(4, 'BANK_TRANSFER_AWASH', 'Awash Bank Transfer', 'Awash Bank direct account transfer or Awash Birr transfer with reference reconciliation.', 'BANK_TRANSFER', TRUE, 4),
(5, 'BANK_TRANSFER_DASHEN', 'Dashen Bank / Amole', 'Dashen Bank direct account transfer or Amole mobile banking deposit.', 'BANK_TRANSFER', TRUE, 5),
(6, 'BANK_TRANSFER_BOA', 'Bank of Abyssinia / Apollo', 'Bank of Abyssinia direct account deposit or Apollo mobile banking.', 'BANK_TRANSFER', TRUE, 6),
(7, 'CASH_ON_DELIVERY', 'Cash on Delivery (Addis Ababa Only)', 'Pay securely in cash or via mobile money upon receiving your perfume package.', 'CASH', TRUE, 7)
ON CONFLICT (id) DO NOTHING;

-- Bank Accounts for Transfer Workflow
INSERT INTO bank_accounts (id, bank_name, account_number, account_holder_name, branch, qr_code_url, instructions, is_active)
VALUES
(1, 'Commercial Bank of Ethiopia (CBE)', '1000284910291', 'EDRIS PERFUME TRADING PLC', 'Finfine Branch, Addis Ababa', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=1000284910291', 'Please use your Order Number (e.g., EDR-...) as the transfer reason/remark. Upload your SMS transaction ID or screenshot after transfer.', TRUE),
(2, 'Awash Bank', '01304859182000', 'EDRIS PERFUME TRADING PLC', 'Bole Medhanialem Branch', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=01304859182000', 'Transfer via Awash Online or Awash Birr. Quote your unique Order ID in the reference field.', TRUE),
(3, 'Dashen Bank', '5082910394851', 'EDRIS PERFUME TRADING PLC', 'Kazanchis Branch', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=5082910394851', 'Transfer using Amole or Dashen Mobile. Submit reference ID for verification.', TRUE),
(4, 'Bank of Abyssinia', '78491029384', 'EDRIS PERFUME TRADING PLC', 'Meskel Square Branch', 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=78491029384', 'Use Apollo app or direct branch deposit. Order is confirmed upon automated or operator reconciliation.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active)
VALUES
(1, 'WELCOME10', 'PERCENTAGE', 10.00, 5000.00, 2500.00, TRUE),
(2, 'EDRISGOLD', 'FIXED_AMOUNT', 1000.00, 10000.00, 1000.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Advertising Campaigns
INSERT INTO advertising_campaigns (id, title, subtitle, image_url, cta_text, cta_link, placement, is_active, display_order)
VALUES
(1, 'Elegance in Every Drop', 'Discover the Royal Extrait Collection, handcrafted with the finest Ethiopian mountain frankincense and Grasse florals.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1600', 'Shop The Collection', '/shop', 'HERO_CAROUSEL', TRUE, 1),
(2, 'Addis Nights Oud Edition', 'A sensory voyage through midnight velvet and warm ceremonial amber. Complimentary fast delivery within Addis Ababa.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1600', 'Explore Oud Blends', '/shop?category=oriental-oud', 'HERO_CAROUSEL', TRUE, 2),
(3, 'Become an Edris Merchant Partner', 'Join Ethiopia''s most distinguished luxury perfume marketplace. Reach connoisseurs nationwide with secure escrow and payouts.', 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=1200', 'Apply to Sell', '/merchant/register', 'FEATURED_BANNER', TRUE, 3)
ON CONFLICT (id) DO NOTHING;

-- Sample Order & Transactions
INSERT INTO orders (id, order_number, customer_id, subtotal, discount_amount, delivery_fee, tax_amount, total_amount, currency, order_status, payment_status, fulfillment_status, shipping_full_name, shipping_phone, shipping_city, shipping_subcity, shipping_address_line, tracking_number, created_at, updated_at)
VALUES
(1, 'EDR-2026-88192', 3, 14500.00, 0, 150.00, 0, 14650.00, 'ETB', 'CONFIRMED', 'SUCCEEDED', 'PACKED', 'Selamawit Tadesse', '+251933445566', 'Addis Ababa', 'Bole', 'House 42, Near Edna Mall', 'ET-DISP-9921', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 days'),
(2, 'EDR-2026-90412', 3, 12800.00, 1000.00, 150.00, 0, 11950.00, 'ETB', 'PENDING_PAYMENT', 'AWAITING_CUSTOMER_ACTION', 'UNFULFILLED', 'Selamawit Tadesse', '+251933445566', 'Addis Ababa', 'Kirkos', 'Kazanchis Supermarket area', 'ET-DISP-9988', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, product_id, merchant_id, product_name, sku, unit_price, quantity, subtotal, merchant_commission_amount)
VALUES
(1, 1, 1, 1, 'Edris Royale Extrait', 'EDR-ROY-100', 14500.00, 1, 14500.00, 1450.00),
(2, 2, 2, 1, 'Addis Nights Oud', 'EDR-ADD-100', 12800.00, 1, 12800.00, 1280.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_transactions (id, transaction_reference, order_id, customer_id, payment_method_id, provider, merchant_order_ref, provider_trans_ref, expected_amount, verified_amount, currency, payment_status, provider_status_code, verified_at, created_at, updated_at)
VALUES
(1, 'TXN-EDR-9981-TEL', 1, 3, 1, 'TELEBIRR', 'EDR-2026-88192', 'TB-PAY-882910398', 14650.00, 14650.00, 'ETB', 'SUCCEEDED', 'SUCCESS_200', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 'TXN-EDR-9982-BNK', 2, 3, 3, 'BANK_TRANSFER', 'EDR-2026-90412', NULL, 11950.00, NULL, 'ETB', 'AWAITING_CUSTOMER_ACTION', 'PENDING_DEPOSIT', NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Customer Loyalty Profile
INSERT INTO customer_loyalty (id, customer_id, points_balance, lifetime_points, tier, created_at, updated_at)
VALUES
(1, 3, 146, 146, 'SILVER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Delivery tracking event
INSERT INTO delivery_tracking_events (order_id, status, location, description, timestamp)
VALUES
(1, 'ORDER_CONFIRMED', 'Edris Addis Fulfillment Center', 'Payment verified via Telebirr. Order placed into packing queue.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 'PACKED', 'Bole Hub Warehouse', 'Fragrance packaged in luxury white & gold velvet presentation box.', CURRENT_TIMESTAMP - INTERVAL '1 days')
ON CONFLICT DO NOTHING;

-- Seed data complete

