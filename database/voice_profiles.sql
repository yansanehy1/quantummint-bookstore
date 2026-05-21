-- database/voice_profiles.sql

CREATE TABLE IF NOT EXISTS voice_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    educator_id UUID NOT NULL,
    base_pitch_hz FLOAT,
    spectral_tilt FLOAT,
    formant_shift FLOAT,
    provider VARCHAR(50) DEFAULT 'internal',
    provider_voice_id VARCHAR(255),
    language_code VARCHAR(10) DEFAULT 'en',
    sample_count INTEGER DEFAULT 0,
    total_duration_seconds FLOAT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'analyzing',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voice_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES voice_profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    storage_provider VARCHAR(50) DEFAULT 'local',
    duration_seconds FLOAT DEFAULT 0,
    sample_rate INTEGER DEFAULT 44100,
    channels INTEGER DEFAULT 1,
    format VARCHAR(10),
    snr_db FLOAT,
    clipping_detected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at (assuming update_updated_at_column() function exists)
DROP TRIGGER IF EXISTS update_voice_profiles_updated_at ON voice_profiles;
CREATE TRIGGER update_voice_profiles_updated_at
    BEFORE UPDATE ON voice_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
