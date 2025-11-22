-- See user's provided schema; placing as-is.
-- Enhanced users table with indexes
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'seller', 'user') DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);

CREATE TABLE books (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  level ENUM('JSS', 'SSS', 'OTHER') NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  price_usd DECIMAL(10,2),
  price_sll DECIMAL(15,2),
  cover_image_url TEXT,
  total_pages INT,
  published BOOLEAN DEFAULT FALSE,
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  total_purchases INT DEFAULT 0,
  search_vector TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_level (level),
  INDEX idx_created_by (created_by),
  INDEX idx_approval_status (approval_status),
  INDEX idx_average_rating (average_rating),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_search (title, description, search_vector)
);

CREATE TABLE reading_sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  book_id VARCHAR(36) NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  paused_time BIGINT,
  total_paused_duration INT DEFAULT 0,
  charge_per_minute DECIMAL(10,4) NOT NULL,
  total_charged DECIMAL(15,2) DEFAULT 0,
  pages_read INT DEFAULT 0,
  words_read INT DEFAULT 0,
  status ENUM('active', 'paused', 'terminated') DEFAULT 'active',
  termination_reason VARCHAR(100),
  device_info JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  INDEX idx_user_id (user_id),
  INDEX idx_book_id (book_id),
  INDEX idx_start_time (start_time),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE daily_user_analytics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  total_reading_time INT DEFAULT 0,
  total_cost DECIMAL(15,2) DEFAULT 0,
  books_read INT DEFAULT 0,
  sessions_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_date (user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_date (date),
  INDEX idx_user_date (user_id, date)
);

CREATE TABLE user_learning_patterns (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  preferred_subjects JSON,
  preferred_reading_times JSON,
  average_reading_speed INT,
  consistency_score DECIMAL(5,2),
  learning_goals JSON,
  last_analysis_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user (user_id)
);
