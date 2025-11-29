-- QuantumMint Bookstore Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'educator', 'admin') DEFAULT 'user',
    balance DECIMAL(10, 2) DEFAULT 0.00,
    avatarUrl VARCHAR(255),
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sellers Table
CREATE TABLE IF NOT EXISTS Sellers (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    businessName VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    commissionRate DECIMAL(5, 2) DEFAULT 10.00,
    paymentDetails JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Books Table
CREATE TABLE IF NOT EXISTS Books (
    id CHAR(36) PRIMARY KEY,
    sellerId CHAR(36),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    priceUSD DECIMAL(10, 2) DEFAULT 0.00,
    priceSLL DECIMAL(10, 2) DEFAULT 0.00,
    coverUrl VARCHAR(255),
    fileUrl VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    educationLevel ENUM('JSS', 'SSS', 'College', 'University', 'Adult Education', 'General') DEFAULT 'General',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sellerId) REFERENCES Sellers(id) ON DELETE SET NULL
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS Purchases (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    bookId CHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency ENUM('USD', 'SLL') DEFAULT 'USD',
    status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookId) REFERENCES Books(id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS Transactions (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    type ENUM('deposit', 'purchase', 'withdrawal', 'referral_bonus', 'gift') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS Referrals (
    id CHAR(36) PRIMARY KEY,
    referrerId CHAR(36) NOT NULL,
    referredId CHAR(36),
    code VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('active', 'pending', 'completed') DEFAULT 'pending',
    rewardType VARCHAR(50) DEFAULT 'reading_time',
    rewardAmount INT DEFAULT 120,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referrerId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (referredId) REFERENCES Users(id) ON DELETE SET NULL
);
