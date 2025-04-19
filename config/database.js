const mongoose = require("mongoose");
const { Pool } = require("pg");
require("dotenv").config();

let pool;

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

exports.postgreConnect = async () => {
  try {
    pool = new Pool({
      connectionString: process.env.POSTGRESQL,
    });

    await pool.query("SELECT NOW()"); 

    console.log("✅ PostgreSQL connected successfully");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    process.exit(1); 
  }
};

exports.pgPool = () => {
  try {
    if (!pool) {
      throw new Error("PostgreSQL pool is not initialized yet");
    }
    return pool;
  } catch (error) {
    console.log(error)
  }
};
