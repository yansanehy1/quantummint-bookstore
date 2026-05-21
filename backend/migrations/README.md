# Database migrations

Schema is managed with Sequelize `sync` via:

```bash
cd backend
npm run migrate
```

- **Development** (apply column changes): `DB_SYNC_ALTER=true npm run migrate`
- **Production** (create missing tables only): `npm run migrate` without `DB_SYNC_ALTER`

For CI and integration tests, SQLite in-memory is used (`SQLITE_PATH=:memory:`).
