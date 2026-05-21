#!/usr/bin/env node
/**
 * Applies Sequelize schema to the configured database.
 * Production: run without DB_SYNC_ALTER (creates missing tables only).
 * Development: set DB_SYNC_ALTER=true to apply column changes via alter.
 */
require('dotenv').config();
const { createSequelize } = require('../config/database');

async function main() {
    const sequelize = createSequelize();
    require('../models')(sequelize);

    await sequelize.authenticate();
    const useAlter = process.env.DB_SYNC_ALTER === 'true';
    await sequelize.sync(useAlter ? { alter: true } : {});
    console.log(`Migration complete (${sequelize.getDialect()}, alter=${useAlter})`);
    await sequelize.close();
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
