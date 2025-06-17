const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

// Load .env
dotenv.config();

// Import routes
const benihRoutes = require("../src/routes/BenihsRoutes");
const bookingTransactionRoutes = require("../src/routes/BookingTransactionRoutes");
const brandRoutes = require("../src/routes/Brands");
const categoryRoutes = require("../src/routes/Categories");

// Init express app
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"))); // serve file uploads

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/padi-app";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/v1/benihs", benihRoutes);
app.use("/api/v1/booking-transactions", bookingTransactionRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/categories", categoryRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
