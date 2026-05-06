-- Educational Platform Schema Update
-- Add missing tables and columns for immersive media-synchronized educational platform

USE quantummint_db;

-- Add educational columns to existing Books table
ALTER TABLE Books 
ADD COLUMN IF NOT EXISTS isbn VARCHAR(20),
ADD COLUMN IF NOT EXISTS pages_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status ENUM('draft', 'review', 'published', 'archived') DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS total_duration INT DEFAULT 0, -- in seconds
ADD COLUMN IF NOT EXISTS total_views INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_purchases INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

-- Categories table for educational content
CREATE TABLE IF NOT EXISTS Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INT NULL,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES Categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id),
    INDEX idx_active (is_active)
);

-- Book pages table for content structure
CREATE TABLE IF NOT EXISTS BookPages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id CHAR(36) NOT NULL,
    page_number INT NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    audio_url VARCHAR(500),
    audio_duration INT DEFAULT 0, -- in seconds
    position_in_file INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_book_page (book_id, page_number),
    INDEX idx_book_id (book_id),
    INDEX idx_page_number (page_number)
);

-- Media cues table for synchronization
CREATE TABLE IF NOT EXISTS MediaCues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id CHAR(36) NOT NULL,
    page_id INT NOT NULL,
    cue_type ENUM('visual', 'formula', 'step', 'highlight') NOT NULL,
    timestamp_ms INT NOT NULL, -- milliseconds in audio
    content TEXT NOT NULL, -- formula, image URL, or step text
    metadata JSON, -- additional data for complex cues
    position_data JSON, -- positioning info for visuals
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES BookPages(id) ON DELETE CASCADE,
    INDEX idx_book_id (book_id),
    INDEX idx_page_id (page_id),
    INDEX idx_timestamp (timestamp_ms),
    INDEX idx_cue_type (cue_type),
    INDEX idx_active (is_active)
);

-- Reading progress table
CREATE TABLE IF NOT EXISTS ReadingProgress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,
    page_id INT NOT NULL,
    current_position INT DEFAULT 0, -- in milliseconds
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent INT DEFAULT 0, -- in seconds
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES BookPages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book_page (user_id, book_id, page_id),
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_completion (completion_percentage)
);

-- User reviews table
CREATE TABLE IF NOT EXISTS UserReviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_published BOOLEAN DEFAULT true,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book_review (user_id, book_id),
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_rating (rating),
    INDEX idx_published (is_published)
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS AnalyticsEvents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36),
    book_id CHAR(36),
    page_id INT,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_event_type (event_type),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);

-- Gamification achievements table
CREATE TABLE IF NOT EXISTS Achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_icon_url VARCHAR(500),
    criteria JSON NOT NULL, -- criteria for earning the achievement
    points_value INT DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);

-- User achievements table
CREATE TABLE IF NOT EXISTS UserAchievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES Achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user_id (user_id),
    INDEX idx_earned_at (earned_at)
);

-- Insert sample categories
INSERT INTO Categories (name, description, slug, icon_url) VALUES
('Mathematics', 'Mathematical concepts and formulas', 'mathematics', '/icons/math.svg'),
('Physics', 'Physical principles and laws', 'physics', '/icons/physics.svg'),
('Chemistry', 'Chemical reactions and compounds', 'chemistry', '/icons/chemistry.svg'),
('Biology', 'Biological processes and systems', 'biology', '/icons/biology.svg'),
('Computer Science', 'Programming and algorithms', 'computer-science', '/icons/cs.svg'),
('Languages', 'Foreign language learning', 'languages', '/icons/language.svg');

-- Insert sample achievements
INSERT INTO Achievements (name, description, badge_icon_url, criteria, points_value) VALUES
('First Purchase', 'Purchased your first educational book', '/badges/first-purchase.svg', '{"type": "first_purchase"}', 50),
('Speed Reader', 'Completed a book in under 2 hours', '/badges/speed-reader.svg', '{"type": "completion_time", "max_hours": 2}', 100),
('Math Enthusiast', 'Completed 5 mathematics books', '/badges/math-enthusiast.svg', '{"type": "category_completion", "category": "mathematics", "count": 5}', 200),
('Formula Master', 'Viewed 100+ formulas', '/badges/formula-master.svg', '{"type": "formula_views", "count": 100}', 75),
('Consistent Learner', 'Studied for 7 consecutive days', '/badges/streak-7.svg', '{"type": "daily_streak", "days": 7}', 150);

-- Add full-text search index for books
ALTER TABLE Books ADD FULLTEXT INDEX ft_search (title, description);

-- Update existing books to have default categories
UPDATE Books SET category = 'General' WHERE category IS NULL OR category = '';

-- Add foreign key constraint for category if not exists
-- Note: This will need to be handled carefully based on existing data
