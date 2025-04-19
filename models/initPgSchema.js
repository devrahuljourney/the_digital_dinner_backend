const { pgPool } = require("../config/database");

const initPgSchema = async () => {
const pool = pgPool()

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE 
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        total_price NUMERIC,
        address VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id),
        menu_item_id VARCHAR(50),  -- from MongoDB _id
        quantity INT NOT NULL
      );
    `);

    console.log("✅ PostgreSQL tables created (or already exist)");
  } catch (err) {
    console.error("❌ Error creating PostgreSQL tables:", err);
  }
};

module.exports = initPgSchema;
