-- QuantumMint Bookstore Database Schema
-- Compatible with MySQL / MariaDB (Hostinger)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` ENUM('learner', 'seller', 'admin') DEFAULT 'learner',
  `profile_image_url` VARCHAR(512),
  `bio` TEXT,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. SELLER PROFILES (Extension of Users for Sellers)
-- --------------------------------------------------------

CREATE TABLE `seller_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `business_name` VARCHAR(255),
  `business_type` VARCHAR(50),
  `tax_id` VARCHAR(100),
  `phone_number` VARCHAR(50),
  `country` VARCHAR(100),
  `city` VARCHAR(100),
  `bank_name` VARCHAR(255),
  `account_number` VARCHAR(100),
  `onboarding_status` ENUM('pending', 'in_review', 'approved', 'rejected') DEFAULT 'pending',
  `rejection_reason` TEXT,
  `total_earnings` DECIMAL(15, 2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. WALLETS & CURRENCY
-- --------------------------------------------------------

CREATE TABLE `wallets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `balance_usd` DECIMAL(15, 2) DEFAULT 0.00,
  `balance_sll` DECIMAL(15, 2) DEFAULT 0.00, -- Sierra Leonean Leone
  `credits` INT DEFAULT 0, -- Platform specific credits
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `transactions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `wallet_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('deposit', 'withdrawal', 'purchase', 'refund', 'earning', 'referral_bonus') NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `currency` ENUM('USD', 'SLL') DEFAULT 'USD',
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `reference_id` VARCHAR(255), -- External payment gateway ID (e.g., Stripe, Orange Money)
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. BOOKS & CONTENT
-- --------------------------------------------------------

CREATE TABLE `books` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `seller_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255),
  `description` TEXT,
  `cover_image_url` VARCHAR(512),
  `category` VARCHAR(100),
  `level` ENUM('JSS', 'SSS', 'beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  `price_usd` DECIMAL(10, 2) DEFAULT 0.00,
  `price_sll` DECIMAL(15, 2) DEFAULT 0.00,
  `status` ENUM('draft', 'pending_approval', 'published', 'rejected') DEFAULT 'draft',
  `rejection_reason` TEXT,
  `average_rating` DECIMAL(3, 2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `book_pages` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `book_id` BIGINT UNSIGNED NOT NULL,
  `page_number` INT NOT NULL,
  `title` VARCHAR(255),
  `content_raw` TEXT, -- The raw text content
  `audio_url` VARCHAR(512), -- Optional full page audio
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_page` (`book_id`, `page_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. IMMERSIVE CONTENT SEGMENTS (AI Generated)
-- --------------------------------------------------------

CREATE TABLE `content_segments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_id` BIGINT UNSIGNED NOT NULL,
  `sequence_order` INT NOT NULL,
  `type` ENUM('narrative', 'formula', 'step', 'concept') NOT NULL,
  `text_content` TEXT NOT NULL,
  `spoken_text` TEXT, -- Optimized for TTS
  `visual_prompt` TEXT, -- Prompt sent to image generator
  `formula_latex` TEXT, -- LaTeX code for math/science
  `audio_url` VARCHAR(512), -- URL to generated TTS audio file
  `visual_url` VARCHAR(512), -- URL to generated image file
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`page_id`) REFERENCES `book_pages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. LIBRARY & READING PROGRESS
-- --------------------------------------------------------

CREATE TABLE `library_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `book_id` BIGINT UNSIGNED NOT NULL,
  `access_type` ENUM('purchased', 'subscription', 'pay_per_use') DEFAULT 'purchased',
  `purchase_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_library_entry` (`user_id`, `book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reading_progress` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `book_id` BIGINT UNSIGNED NOT NULL,
  `current_page` INT DEFAULT 1,
  `current_segment_index` INT DEFAULT 0,
  `completion_percentage` DECIMAL(5, 2) DEFAULT 0.00,
  `last_read_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_progress` (`user_id`, `book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bookmarks` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `book_id` BIGINT UNSIGNED NOT NULL,
  `page_number` INT NOT NULL,
  `note` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. REVIEWS & SOCIAL
-- --------------------------------------------------------

CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `book_id` BIGINT UNSIGNED NOT NULL,
  `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `title` VARCHAR(255),
  `content` TEXT,
  `is_verified_purchase` BOOLEAN DEFAULT FALSE,
  `helpful_count` INT DEFAULT 0,
  `unhelpful_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `review_replies` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `review_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL, -- Usually the author
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. REFERRALS
-- --------------------------------------------------------

CREATE TABLE `referrals` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `referrer_id` BIGINT UNSIGNED NOT NULL,
  `referred_email` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'registered', 'completed') DEFAULT 'pending',
  `bonus_amount` DECIMAL(10, 2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`referrer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. PAY-PER-USE SESSIONS
-- --------------------------------------------------------

CREATE TABLE `reading_sessions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `book_id` BIGINT UNSIGNED NOT NULL,
  `session_type` ENUM('reading', 'listening') NOT NULL,
  `start_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `end_time` TIMESTAMP NULL,
  `duration_minutes` INT DEFAULT 0,
  `cost_incurred` DECIMAL(10, 2) DEFAULT 0.00,
  `status` ENUM('active', 'completed', 'terminated') DEFAULT 'active',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;