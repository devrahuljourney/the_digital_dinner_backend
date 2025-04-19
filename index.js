const express = require("express");
const app = express();

const dotenv = require("dotenv"); 
const fileUpload = require("express-fileupload");
const cors = require("cors");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const categoryRoute = require("./routes/Category");
const productRoute = require("./routes/Product");
const orderRoute = require("./routes/Order");
const initPgSchema = require("./models/initPgSchema");

dotenv.config(); 
const PORT = process.env.PORT || 4000;

const connectSchema = async () => {
  try {
    await database.postgreConnect();
    await initPgSchema(); 
  } catch (err) {
    console.error("❌ Error during PostgreSQL schema initialization:", err);
    process.exit(1);  
  }
};

database.mongoDbConnect();
connectSchema(); 

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.ORIGIN_URL,
      process.env.ORIGIN_URL1,
      
    ],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary setup
cloudinaryConnect();

// Routes
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 App is running at http://localhost:${PORT}`);
});
