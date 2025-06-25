const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (hanya user yang sudah login)
router.get('/me', protect, getMe);

module.exports = router;
