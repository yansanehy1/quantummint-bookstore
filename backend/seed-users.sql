-- QuantumMint Bookstore - User Seed Data
-- This file contains demo user accounts for testing
-- Password for all accounts: password123
-- Passwords are bcrypt hashed with cost factor 10

INSERT INTO Users (id, email, password, name, role, balance, isVerified, createdAt, updatedAt) VALUES
('52c67621-7457-4a0e-a298-5520077a2dba', 'learner@quantummint.com', '$2b$10$IEeIf5vnczIlsGxV29PQeukqmTRrf2yW.X6P9ItDasSKPzUnjfAfS', 'John Learner', 'user', 50.00, 1, datetime('now'), datetime('now')),
('862a5530-58a3-4ca6-b4eb-e98cd6c69a41', 'creator@quantummint.com', '$2b$10$kif8wT2hm8g2uQCBu3n2quWfEOup3sZfoYkGBu25/xsAQGMgJIlMe', 'Sarah Creator', 'educator', 150.00, 1, datetime('now'), datetime('now')),
('4504dde9-0393-48e1-b0bd-807e4785e0b9', 'admin@quantummint.com', '$2b$10$xCQcw1aa8G4XOT79RxZpOuDuNfo7/Hzhijd6ogPNJH19VOuaRWyta', 'Admin User', 'admin', 1000.00, 1, datetime('now'), datetime('now')),
('0da6192a-80fd-4352-b649-29f7b6be6b6a', 'support@quantummint.com', '$2b$10$sJfBjmDpeb0u7eLiSOsvzun.IP5kJRJx4RwX.7n6Jfr3Q4ecet38e', 'Support Team', 'user', 100.00, 1, datetime('now'), datetime('now')),
('6c1bbf38-dbae-49f7-a7da-b83fe4cb04f1', 'test@test.com', '$2b$10$sLhsAEoH8onM4mBi6SXrd./M3dgqWn3hUibzlo5HKMLgxgL.F7Iii', 'Test User', 'user', 25.00, 1, datetime('now'), datetime('now')),
('ca0cfe93-a370-4d6f-a1d5-664c36f29975', 'john@example.com', '$2b$10$D8xPbBEM72NZoH5fvVFeAOqlxUbuFrZzI5FcP8lSgxUtw1yGZlK86', 'John Doe', 'user', 75.50, 1, datetime('now'), datetime('now'));

-- Add creator as seller
INSERT INTO Sellers (id, userId, businessName, status, commissionRate, createdAt, updatedAt) VALUES
('2e828ac5-3bb9-4f53-b944-6d6634ef5ee3', '862a5530-58a3-4ca6-b4eb-e98cd6c69a41', 'Sarah Creator Publishing', 'approved', 15.00, datetime('now'), datetime('now'));

-- Account Summary:
-- 1. learner@quantummint.com - Regular learner/student account
-- 2. creator@quantummint.com - Content creator with seller profile
-- 3. admin@quantummint.com - Admin account with full platform access
-- 4. support@quantummint.com - Support team account
-- 5. test@test.com - General test account
-- 6. john@example.com - Additional test account
--
-- All accounts use password: password123
