const express = require('express');
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// TODO: Tambahkan middleware autentikasi dan otorisasi jika perlu
// const { protect, adminOnly } = require('../middleware/authMiddleware');

// Route: Public (atau bisa pakai middleware jika ingin membatasi)
router.post('/', createUser);

// Route: Admin only (contoh dengan middleware)
// router.get('/', protect, adminOnly, getAllUsers);
router.get('/', getAllUsers);

router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
