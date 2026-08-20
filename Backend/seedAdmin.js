const pool = require('./db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    const hash = await bcrypt.hash('Tej@ni1234', 10);
    await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Admin User', 'tejanidhruvilofficial.com', hash, 'admin']
    );
    console.log('Admin user seeded successfully');
  } catch (error) {
    console.error('Failed to seed admin', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
