-- database/video_jobs.sql

-- Video processing jobs
CREATE TABLE IF NOT EXISTS video_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Link to main users table (logic depends on your auth system)
    original_filename VARCHAR(255) NOT NULL,
    input_path TEXT NOT NULL,
    output_path TEXT,
    status VARCHAR(50) DEFAULT 'queued'
        CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    error_message TEXT,
    video_metadata JSONB DEFAULT '{}'::jsonb, -- Store duration, resolution, codec
    encoding_options JSONB DEFAULT '{}'::jsonb, -- Store qualities, formats requested
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_video_jobs_user_status ON video_jobs (user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_jobs_pending ON video_jobs (status) WHERE status IN ('queued', 'processing');
CREATE INDEX IF NOT EXISTS idx_video_jobs_metadata ON video_jobs USING gin (video_metadata);

-- Function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_video_jobs_updated_at ON video_jobs;
CREATE TRIGGER update_video_jobs_updated_at
    BEFORE UPDATE ON video_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage usage tracking (for billing)
CREATE TABLE IF NOT EXISTS video_storage_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    video_job_id UUID REFERENCES video_jobs(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_type VARCHAR(50) CHECK (storage_type IN ('original', 'encoded', 'thumbnail')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_storage_usage_user ON video_storage_usage (user_id, created_at);
