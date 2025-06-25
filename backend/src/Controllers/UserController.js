const User = require('../models/User'); // Sesuaikan path ke model Anda
const bcrypt = require('bcryptjs');

// @desc    Create a new user
// @route   POST /api/users
// @access  Public (atau Admin, sesuai kebutuhan)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

    // Validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone
    });

    const savedUser = await user.save();

    // Jangan kirim password kembali ke client
    const userResponse = { ...savedUser._doc };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    // Ambil semua user, tapi jangan sertakan field password
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Admin atau User yang bersangkutan
const getUserById = async (req, res) => {
  try {
    // Ambil user berdasarkan ID, jangan sertakan password
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Admin atau User yang bersangkutan
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;
    
    // Jika password ada di body request, hash password baru tersebut
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    // Cari dan update user
    // { new: true } akan mengembalikan dokumen yang sudah diupdate
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};