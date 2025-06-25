const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

// TODO: Tambahkan middleware autentikasi dan admin jika diperlukan
// const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (aktifkan middleware jika sudah tersedia)
// router.post('/', protect, adminOnly, createProduct);
// router.put('/:id', protect, adminOnly, updateProduct);
// router.delete('/:id', protect, adminOnly, deleteProduct);

router.post('/', upload.uploadProductImage, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
