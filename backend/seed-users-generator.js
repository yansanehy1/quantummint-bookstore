/**
 * Seed Data Generator for QuantumMint Users
 * 
 * This script generates bcrypt hashed passwords for the seed data.
 * Run this once to output the INSERT statements with proper password hashes.
 * 
 * Usage: node seed-users-generator.js
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Demo users to create
const demoUsers = [
  {
    email: 'learner@quantummint.com',
    name: 'John Learner',
    role: 'user',
    balance: 50.00
  },
  {
    email: 'creator@quantummint.com',
    name: 'Sarah Creator',
    role: 'educator',
    balance: 150.00
  },
  {
    email: 'admin@quantummint.com',
    name: 'Admin User',
    role: 'admin',
    balance: 1000.00
  },
  {
    email: 'support@quantummint.com',
    name: 'Support Team',
    role: 'user',
    balance: 100.00
  },
  {
    email: 'test@test.com',
    name: 'Test User',
    role: 'user',
    balance: 25.00
  },
  {
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    balance: 75.50
  }
];

const password = 'password123';
const salt = '$2a$10$'; // bcrypt cost factor 10

async function generateSeedData() {
  console.log('-- QuantumMint Bookstore - User Seed Data');
  console.log('-- Generated seed data with bcrypt hashed passwords');
  console.log('-- Password for all accounts: password123\n');
  
  console.log('-- Users Table Insert');
  console.log('INSERT INTO Users (id, email, password, name, role, balance, isVerified, createdAt, updatedAt) VALUES');
  
  const userIds = [];
  const sqlLines = [];
  
  for (let i = 0; i < demoUsers.length; i++) {
    const user = demoUsers[i];
    const userId = uuidv4();
    userIds.push(userId);
    
    // Generate bcrypt hash
    const hash = await bcrypt.hash(password, 10);
    
    const sqlLine = `('${userId}', '${user.email}', '${hash}', '${user.name}', '${user.role}', ${user.balance}, 1, NOW(), NOW())`;
    sqlLines.push(sqlLine);
  }
  
  console.log(sqlLines.join(',\n'));
  console.log(';\n');
  
  // Add seller profile for creator
  console.log('-- Add creator as seller');
  console.log('INSERT INTO Sellers (id, userId, businessName, status, commissionRate, createdAt, updatedAt) VALUES');
  console.log(`('${uuidv4()}', '${userIds[1]}', 'Sarah Creator Publishing', 'approved', 15.00, NOW(), NOW());`);
  
  console.log('\n-- User IDs created:');
  userIds.forEach((id, i) => {
    console.log(`-- ${demoUsers[i].email}: ${id}`);
  });
}

generateSeedData().catch(console.error);
