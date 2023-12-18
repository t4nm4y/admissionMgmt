const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // only for development purposes
  },
});


const createTables = async () => {
  try {
    // Creating Batch table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Batches" (
        batch_id SERIAL PRIMARY KEY,
        batch_time VARCHAR(20) UNIQUE NOT NULL
      );
      INSERT INTO "Batches" (batch_time) VALUES
      ('6-7AM'),
      ('7-8AM'),
      ('8-9AM'),
      ('5-6PM')
      ON CONFLICT DO NOTHING;
      `);

    // Creating User table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS "Users" (
      user_id SERIAL PRIMARY KEY,
      user_pswd VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) UNIQUE NOT NULL,
      age INT CHECK (age >= 18 AND age <= 65) NOT NULL,
      batch_id INT REFERENCES "Batches"(batch_id) NOT NULL,
      enrollment_date DATE NOT NULL,
      last_payment_date DATE NOT NULL,
      payment_status VARCHAR(20) DEFAULT 'pending'
    );
    `);


    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};
module.exports = { pool, createTables };
