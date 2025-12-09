// Database Connection Test & Migration Runner
// Use this script to test database connectivity and run migrations

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/quantummint',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Test database connection
 */
async function testConnection() {
    console.log('Testing database connection...');

    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
        console.log('✅ Database connection successful');
        console.log(`📅 Server time: ${result.rows[0].current_time}`);
        console.log(`🐘 PostgreSQL version: ${result.rows[0].postgres_version.split(',')[0]}`);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

/**
 * Check if migration has been run
 */
async function checkMigrationStatus(migrationName) {
    try {
        // Create migrations tracking table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const result = await pool.query(
            'SELECT migration_name FROM schema_migrations WHERE migration_name = $1',
            [migrationName]
        );

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking migration status:', error);
        return false;
    }
}

/**
 * Mark migration as completed
 */
async function markMigrationComplete(migrationName) {
    try {
        await pool.query(
            'INSERT INTO schema_migrations (migration_name) VALUES ($1) ON CONFLICT DO NOTHING',
            [migrationName]
        );
    } catch (error) {
        console.error('Error marking migration complete:', error);
    }
}

/**
 * Run a SQL migration file
 */
async function runMigration(migrationFile) {
    const migrationName = path.basename(migrationFile);

    console.log(`\n📄 Checking migration: ${migrationName}`);

    // Check if already run
    const alreadyRun = await checkMigrationStatus(migrationName);
    if (alreadyRun) {
        console.log(`⏭️  Skipping ${migrationName} (already executed)`);
        return { skipped: true };
    }

    console.log(`🚀 Running migration: ${migrationName}`);

    try {
        // Read migration file
        const sql = await fs.readFile(migrationFile, 'utf-8');

        // Execute in a transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');

            // Mark as complete
            await markMigrationComplete(migrationName);

            console.log(`✅ Migration completed: ${migrationName}`);
            return { success: true };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error(`❌ Migration failed: ${migrationName}`);
        console.error(`Error: ${error.message}`);
        return { error: error.message };
    }
}

/**
 * Run all migrations in order
 */
async function runAllMigrations() {
    const migrationsDir = path.join(__dirname, '../migrations');

    try {
        const files = await fs.readdir(migrationsDir);
        const migrationFiles = files
            .filter(file => file.endsWith('.sql'))
            .filter(file => file !== '001_quantummint_schema.sql') // Skip sample schema
            .sort(); // Run in alphabetical order

        console.log(`\n📦 Found ${migrationFiles.length} migration(s) to process\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            const result = await runMigration(filePath);

            if (result.success) successCount++;
            else if (result.skipped) skipCount++;
            else if (result.error) errorCount++;
        }

        console.log(`\n📊 Migration Summary:`);
        console.log(`   ✅ Successful: ${successCount}`);
        console.log(`   ⏭️  Skipped: ${skipCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);

        return errorCount === 0;

    } catch (error) {
        console.error('Error running migrations:', error);
        return false;
    }
}

/**
 * Verify database schema
 */
async function verifySchema() {
    console.log('\n🔍 Verifying database schema...\n');

    const requiredTables = [
        'wallet_transactions',
        'content',
        'content_sessions',
        'creator_earnings',
        'payouts',
        'email_notifications',
        'certificates',
        'email_preferences',
        'live_streams',
        'live_stream_registrations'
    ];

    try {
        for (const table of requiredTables) {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                )
            `, [table]);

            if (result.rows[0].exists) {
                console.log(`✅ Table exists: ${table}`);
            } else {
                console.log(`❌ Table missing: ${table}`);
            }
        }

        // Check views
        const views = ['daily_revenue', 'creator_earnings_summary', 'user_engagement'];
        console.log('\nViews:');
        for (const view of views) {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.views 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                )
            `, [view]);

            if (result.rows[0].exists) {
                console.log(`✅ View exists: ${view}`);
            } else {
                console.log(`❌ View missing: ${view}`);
            }
        }

    } catch (error) {
        console.error('Error verifying schema:', error);
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('='.repeat(60));
    console.log('QuantumMint Database Migration Tool');
    console.log('='.repeat(60));

    // Test connection
    const connected = await testConnection();
    if (!connected) {
        console.log('\n❌ Cannot proceed without database connection');
        process.exit(1);
    }

    // Run migrations
    const success = await runAllMigrations();

    // Verify schema
    await verifySchema();

    // Close pool
    await pool.end();

    console.log('\n' + '='.repeat(60));
    console.log(success ? '✅ All migrations completed successfully!' : '❌ Some migrations failed');
    console.log('='.repeat(60) + '\n');

    process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = {
    testConnection,
    runMigration,
    runAllMigrations,
    verifySchema
};
