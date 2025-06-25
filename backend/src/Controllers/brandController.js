const fs = require('fs');
const path = require('path');
const Brand = require('../models/Brand');

// ========== Create Brand ==========
const createBrand = async (req, res) => {
  console.log('🔥 CREATE BRAND DIPANGGIL')
  console.log('🧾 req.body:', req.body)
  console.log('🖼️ req.file:', req.file)
  try {
    const { name, description, country } = req.body;

    if (!name || !country) {
      return res.status(400).json({ message: 'Nama dan negara wajib diisi' });
    }

    const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : null;

    const newBrand = new Brand({ name, description, country, logoUrl });
    await newBrand.save();

    res.status(201).json({ message: 'Brand berhasil dibuat', data: newBrand });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat brand', error: err.message });
  }
};

// ========== Get All Brands ==========
const getAllBrands = async (req, res) => {
  try {
    const { search, sortBy, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const brands = await Brand.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Brand.countDocuments(filter);

    res.status(200).json({
      data: brands,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== Get Single Brand ==========
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand tidak ditemukan' });
    }
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== Update Brand ==========
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand tidak ditemukan' });

    // Hapus logo lama jika upload logo baru
    if (req.file && brand.logoUrl) {
      const oldPath = path.join(__dirname, '..', brand.logoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedData = {
      ...req.body,
      logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : brand.logoUrl,
    };

    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Brand berhasil diperbarui', data: updatedBrand });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========== Delete Brand ==========
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand tidak ditemukan' });

    // Hapus file logo dari server jika ada
    if (brand.logoUrl) {
      const logoPath = path.join(__dirname, '..', brand.logoUrl);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    res.status(200).json({ message: 'Brand berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
