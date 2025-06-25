const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect } = require('../middlewares/authMiddleware');

// ======================
// 🔐 Protected Routes
// ======================

// User: Buat pesanan baru
router.post('/', protect, createOrder);

// User: Ambil semua pesanan milik user yang login
router.get('/myorders', protect, getMyOrders);

// User & Admin: Lihat detail pesanan (validasi dilakukan di controller)
router.get('/:id', protect, getOrderById);

// Admin: Ambil semua pesanan (dengan pagination & filter status)
router.get('/', protect, getAllOrders);

// Admin: Update status pesanan (e.g., 'shipped', 'cancelled', dll)
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
