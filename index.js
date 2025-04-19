const express = require("express");
const app = express();

const dotenv = require("dotenv"); 
const fileUpload = require("express-fileupload");
const cors = require("cors");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const initPgSchema = require("./models/initPgSchema");
const categoryRoute = require("./routes/Category")

dotenv.config(); // ✅ Now works fine
const PORT = process.env.PORT || 4000;

// Connect to databases
database.mongoDbConnect();
database.postgreConnect();
initPgSchema();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.ORIGIN_URL,
      process.env.ORIGIN_URL1,
      process.env.ORIGIN_URL2,
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
