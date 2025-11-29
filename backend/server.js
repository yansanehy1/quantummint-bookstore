require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

// Import Models
const db = require('./models')(sequelize);

// Test Connection and Sync Models
sequelize.authenticate()
    .then(() => {
        console.log('Connected to Hostinger MySQL!');
        // Sync models with database (creates tables if they don't exist)
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => console.error('Connection failed:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/auth', authRoutes);

// Simple Route
app.get('/', (req, res) => {
    res.send('QuantumMint API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});