const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to database and seed file
const dbPath = path.join(__dirname, 'database.sqlite');
const seedPath = path.join(__dirname, 'seed-users.sql');

// Read seed SQL
const seedSQL = fs.readFileSync(seedPath, 'utf8');

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Run seed SQL
db.exec(seedSQL, (err) => {
    if (err) {
        console.error('Error executing seed SQL:', err.message);
        return;
    }
    console.log('Seed data imported successfully!');

    // Verify users were created
    db.all('SELECT email, name, role FROM Users', [], (err, rows) => {
        if (err) {
            console.error('Error querying users:', err.message);
        } else {
            console.log('\nCreated users:');
            rows.forEach(row => {
                console.log(`- ${row.email} (${row.role})`);
            });
        }
        db.close();
    });
});