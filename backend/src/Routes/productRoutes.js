const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  buyProduct, // ✅ import fungsi pembelian
} = require('../controllers/productController');

const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', upload.uploadProductImage, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/buy', buyProduct); // ✅ route pembelian

module.exports = router;
