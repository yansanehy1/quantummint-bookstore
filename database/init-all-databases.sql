-- scripts/init-all-databases.sql
-- Create databases
CREATE DATABASE siera;
CREATE DATABASE siera_video;
CREATE DATABASE siera_audiobook;
CREATE DATABASE siera_bookstore;

-- Connect to main database
\c siera;

-- Users table (unified across platform)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(200),
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) DEFAULT 'customer',
    profile_picture_url TEXT,
    bio TEXT,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(100),
    reset_token VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active'
);

-- Authors/Creators table
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pen_name VARCHAR(200),
    bio TEXT,
    expertise TEXT[],
    social_links JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (unified for videos, audiobooks, ebooks)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    full_description TEXT,
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('video', 'audiobook', 'ebook', 'bundle')),
    
    -- Common metadata
    creator_id UUID REFERENCES creators(id),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    language VARCHAR(50) DEFAULT 'English',
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    pricing_model VARCHAR(20) DEFAULT 'one_time' CHECK (pricing_model IN ('one_time', 'subscription', 'rental', 'pay_per_minute')),
    
    -- Content details
    duration_seconds INTEGER,
    word_count INTEGER,
    page_count INTEGER,
    file_size BIGINT,
    file_format VARCHAR(50),
    
    -- Scientific/Educational metadata
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    subject_area VARCHAR(100),
    educational_standards JSONB,
    prerequisites TEXT[],
    learning_objectives TEXT[],
    
    -- Media files
    cover_image_url TEXT,
    preview_url TEXT,
    sample_duration INTEGER DEFAULT 300,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'published', 'unpublished', 'archived')),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_product_type (product_type),
    INDEX idx_creator (creator_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published (published_at)
);

-- Product versions (for updates)
CREATE TABLE product_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    changelog TEXT,
    file_hash VARCHAR(64),
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, version_number)
);

-- Video-specific metadata
CREATE TABLE video_metadata (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    resolution VARCHAR(20),
    aspect_ratio VARCHAR(20),
    frame_rate INTEGER,
    codec VARCHAR(50),
    bitrate VARCHAR(20),
    has_subtitles BOOLEAN DEFAULT false,
    subtitle_languages TEXT[],
    chapters JSONB,
    quality_levels JSONB
);

-- Audiobook-specific metadata
CREATE TABLE audiobook_metadata (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    narrator VARCHAR(200),
    voice_type VARCHAR(50),
    has_scientific_explanations BOOLEAN DEFAULT false,
    explanation_level VARCHAR(20) DEFAULT 'moderate',
    has_visualizations BOOLEAN DEFAULT false,
    visualization_count INTEGER DEFAULT 0,
    chapter_timings JSONB,
    formula_explanations JSONB,
    concept_visualizations JSONB
);

-- Ebook-specific metadata
CREATE TABLE ebook_metadata (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    isbn VARCHAR(20),
    publisher VARCHAR(200),
    publication_date DATE,
    edition VARCHAR(50),
    has_drm BOOLEAN DEFAULT true,
    supported_devices TEXT[],
    page_orientation VARCHAR(20) DEFAULT 'portrait',
    interactive_features JSONB
);

-- Product files
CREATE TABLE product_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('main', 'preview', 'thumbnail', 'subtitle', 'attachment')),
    file_path TEXT NOT NULL,
    file_name VARCHAR(255),
    mime_type VARCHAR(100),
    file_size BIGINT,
    duration_seconds INTEGER,
    quality VARCHAR(50),
    language VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_files (product_id, file_type)
);

-- Purchases table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    purchase_type VARCHAR(20) DEFAULT 'one_time' CHECK (purchase_type IN ('one_time', 'subscription', 'rental')),
    
    -- Pricing
    amount_paid DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    platform_fee DECIMAL(10,2),
    creator_earnings DECIMAL(10,2),
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Payment info
    payment_method VARCHAR(50),
    payment_id VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Access
    access_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_end TIMESTAMP,
    license_key VARCHAR(100),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'refunded')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_purchases (user_id),
    INDEX idx_product_purchases (product_id),
    INDEX idx_purchase_date (created_at)
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID,
    plan_name VARCHAR(100),
    
    -- Subscription details
    interval VARCHAR(20) CHECK (interval IN ('monthly', 'yearly', 'quarterly')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- Payment
    payment_method_id VARCHAR(100),
    latest_invoice_id VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_subscriptions (user_id),
    INDEX idx_subscription_status (status)
);

-- Watch/Listen history
CREATE TABLE consumption_history (
    id UUID PRIMARY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Progress
    progress_seconds INTEGER DEFAULT 0,
    total_seconds INTEGER NOT NULL,
    percentage_complete DECIMAL(5,2) DEFAULT 0.00,
    last_position_seconds INTEGER DEFAULT 0,
    
    -- Engagement
    completed BOOLEAN DEFAULT false,
    completion_count INTEGER DEFAULT 0,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_time_spent INTEGER DEFAULT 0,
    
    -- Notes
    notes TEXT,
    bookmarks JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id),
    INDEX idx_user_history (user_id),
    INDEX idx_recently_played (last_played DESC)
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    
    -- Helpfulness
    helpful_count INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderator_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id),
    INDEX idx_product_reviews (product_id),
    INDEX idx_recent_reviews (created_at DESC)
);

-- Wishlists
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    notes TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id),
    INDEX idx_user_wishlist (user_id)
);

-- Shopping cart
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id),
    INDEX idx_user_cart (user_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_notifications (user_id, read),
    INDEX idx_recent_notifications (created_at DESC)
);

-- Connect to video database
\c siera_video;

-- Video-specific tables
CREATE TABLE video_encodings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL,
    quality VARCHAR(20) NOT NULL,
    width INTEGER,
    height INTEGER,
    bitrate VARCHAR(20),
    codec VARCHAR(50),
    file_path TEXT NOT NULL,
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_video_encodings (video_id, quality)
);

CREATE TABLE video_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_video_jobs (video_id, status),
    INDEX idx_pending_jobs (status, priority DESC)
);

-- Connect to audiobook database
\c siera_audiobook;

-- Audiobook-specific tables
CREATE TABLE audiobook_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audiobook_id UUID NOT NULL,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    start_time_seconds INTEGER DEFAULT 0,
    end_time_seconds INTEGER,
    duration_seconds INTEGER,
    audio_file_path TEXT,
    word_count INTEGER,
    
    UNIQUE(audiobook_id, chapter_number),
    INDEX idx_audiobook_chapters (audiobook_id)
);

CREATE TABLE scientific_explanations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audiobook_id UUID NOT NULL,
    chapter_id UUID REFERENCES audiobook_chapters(id) ON DELETE CASCADE,
    concept VARCHAR(200) NOT NULL,
    explanation TEXT NOT NULL,
    audio_file_path TEXT,
    visualization_path TEXT,
    timestamp_seconds INTEGER,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audiobook_explanations (audiobook_id),
    INDEX idx_concept (concept)
);

CREATE TABLE formula_explanations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audiobook_id UUID NOT NULL,
    latex_formula TEXT NOT NULL,
    spoken_explanation TEXT NOT NULL,
    mathematical_meaning TEXT,
    visualization_path TEXT,
    audio_file_path TEXT,
    timestamp_seconds INTEGER,
    complexity_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audiobook_formulas (audiobook_id)
);

-- Connect to bookstore database
\c siera_bookstore;

-- Bookstore-specific tables
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    curator_id UUID,
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    position INTEGER DEFAULT 0,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(collection_id, product_id),
    INDEX idx_collection_items (collection_id)
);

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL CHECK (source IN ('collaborative', 'content', 'popularity', 'similarity')),
    score DECIMAL(5,4) NOT NULL,
    reason TEXT,
    shown_at TIMESTAMP,
    clicked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_recommendations (user_id, score DESC),
    INDEX idx_product_recommendations (product_id)
);
