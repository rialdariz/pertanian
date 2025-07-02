const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());               // Body parser
app.use(cors());                       // Enable CORS
app.use(morgan('dev'));                // Logging

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // Exit if DB not connected
});

const path = require('path');

// Menyajikan folder uploads agar bisa diakses dari browser
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/beli', require('./src/routes/beliRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('🛒 API is running...');
});

// Error handling (optional, custom)
app.use((err, req, res, next) => {
  console.error('❗ Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
