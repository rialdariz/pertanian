const User = require('../models/User'); // Sesuaikan path ke model Anda
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi untuk generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token akan kedaluwarsa dalam 30 hari
  });
};


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    // 1. Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // 2. Cek jika user sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Buat user baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      // role akan default ke 'user' sesuai schema
    });

    // 5. Jika user berhasil dibuat, kirim kembali data user dan token
    if (user) {
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate token
      };
      res.status(201).json(userResponse);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Cek email user dan ambil data user (termasuk password)
    const user = await User.findOne({ email });

    // 3. Jika user ada DAN password cocok, kirim token
    if (user && (await bcrypt.compare(password, user.password))) {
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate token
      };
      res.status(200).json(userResponse);
    } else {
      // Kirim pesan error yang umum untuk keamanan
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (membutuhkan token)
const getMe = async (req, res) => {
    try {
        // req.user akan diisi oleh middleware otentikasi setelah memverifikasi token
        // Kita hanya mengambil data user tanpa password
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
  register,
  login,
  getMe
};