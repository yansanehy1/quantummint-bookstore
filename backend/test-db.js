require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing database connection...');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log('Password: [HIDDEN]');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log // Enable logging to see more details
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('✅ Connection has been established successfully.');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Unable to connect to the database:');
        console.error(error.message);

        if (error.original) {
            console.error('Original Error Code:', error.original.code);
            console.error('Original Error Message:', error.original.message);
        }

        console.log('\n--- Troubleshooting Tips ---');
        if (error.original && error.original.code === 'ECONNREFUSED') {
            console.log('1. Check if the DB_HOST is correct. Verify in Hostinger hPanel.');
            console.log('2. Check if your internet connection allows outgoing connections to port 3306.');
        } else if (error.original && error.original.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('1. Check if DB_USER and DB_PASS are correct.');
            console.log('2. IMPORTANT: Did you add your IP address to "Remote MySQL" in Hostinger?');
            console.log('   - Go to hPanel -> Databases -> Remote MySQL');
            console.log('   - Add your current IP (or use % for testing)');
        } else if (error.original && error.original.code === 'ENOTFOUND') {
            console.log('1. The hostname is incorrect. Check DB_HOST in .env.');
        }

        process.exit(1);
    });
