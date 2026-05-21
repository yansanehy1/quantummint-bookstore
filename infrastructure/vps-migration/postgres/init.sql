-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search (book titles)

-- Create optimized tables for QuantumMint
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'learner' CHECK (role IN ('learner', 'creator', 'admin')),
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table with full-text search optimization
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    cover_image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    price_usd DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search index for books
CREATE INDEX idx_books_title_trgm ON books USING gin (title gin_trgm_ops);
CREATE INDEX idx_books_search ON books USING gin (
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Chapters table with TTS metadata
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    chapter_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    audio_url VARCHAR(500),
    duration_seconds INTEGER,
    tts_metadata JSONB DEFAULT '{}'::jsonb,
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, chapter_number)
);

-- Usage tracking for TTS billing
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service VARCHAR(50) NOT NULL CHECK (service IN ('tts', 'storage', 'bandwidth')),
    chars_processed INTEGER,
    cost_usd DECIMAL(10, 6),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Critical indexes for performance
CREATE INDEX idx_usage_user_service_date ON usage_logs (user_id, service, created_at DESC);
CREATE INDEX idx_chapters_book_audio ON chapters (book_id, audio_url) WHERE audio_url IS NOT NULL;
CREATE INDEX idx_users_email ON users (email);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
