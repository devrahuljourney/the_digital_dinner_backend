// db/connection.js
const mongoose = require("mongoose");
const { Pool } = require("pg");
require("dotenv").config();

// MongoDB Connection
exports.mongoDbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((error) => {
      console.log("❌ MongoDB connection failed");
      console.error(error);
      process.exit(1);
    });
};

// PostgreSQL Connection (returns a pool instance)
let pool;

exports.postgreConnect = () => {
  try {
    pool = new Pool({
      connectionString: process.env.POSTGRESQL, 
    });

    pool.query("SELECT NOW()", (err, res) => {
      if (err) {
        console.error("❌ PostgreSQL connection failed", err);
        process.exit(1);
      } else {
        console.log("✅ PostgreSQL connected successfully at:", res.rows[0].now);
      }
    });
  } catch (error) {
    console.error("❌ PostgreSQL setup error:", error);
    process.exit(1);
  }
};

exports.pgPool = () => pool;
