const express = require('express');
const router = express.Router();

const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');

const upload = require('../middlewares/uploadMiddleware'); // pastikan path benar


// Middleware otentikasi dan otorisasi (jika ada)
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllBrands);
router.get('/:id', getBrandById);

// Admin-only routes
// router.post('/', protect, adminOnly, createBrand);
// router.put('/:id', protect, adminOnly, updateBrand);
// router.delete('/:id', protect, adminOnly, deleteBrand);

router.post('/', upload.uploadBrandLogo, createBrand); // ✅ BENAR
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
