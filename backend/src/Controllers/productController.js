const Product = require('../models/Product');
const Purchase = require('../models/Beli');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
// Create
const createProduct = async (req, res) => {
  try {
    const { name, description, brand, pricePerKg, stockKg, type } = req.body;

    if (!name || !brand || !pricePerKg || !type) {
      return res.status(400).json({ message: 'Nama, brand, harga, dan tipe wajib diisi.' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      name,
      description,
      brand,
      pricePerKg,
      stockKg,
      type,
      image,
    });

    const saved = await product.save();
    const populated = await Product.findById(saved._id).populate('brand', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        const { brand, type, sortBy, page = 1, limit = 10 } = req.query;

        // 1. Filtering
        const filter = {};
        if (brand) filter.brand = brand; // Filter berdasarkan ID brand
        if (type) filter.type = type;   // Filter berdasarkan tipe ('Hibrida' atau 'Non-Hibrida')

        // 2. Sorting
        const sortOptions = {};
        if (sortBy) {
            // Contoh: sortBy=pricePerKg:asc atau sortBy=createdAt:desc
            const parts = sortBy.split(':');
            sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort by newest
        }

        // 3. Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(filter)
            .populate('brand', 'name imageUrl') // Mengambil 'name' dan 'imageUrl' dari model Brand
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        // Menghitung total dokumen untuk metadata pagination
        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            data: products,
            pagination: {
                total: totalProducts,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalProducts / limitNum),
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand', 'name description'); // Mengambil detail brand

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a product by ID
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // 'new: true' mengembalikan dokumen yang sudah diupdate
        ).populate('brand', 'name');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Buy product and reduce stock
// @route   PATCH /api/products/:id/buy
// @access  Public or Authenticated
const buyProduct = async (req, res) => {
  try {
    const { qty } = req.body;

    if (!qty || qty <= 0) {
      return res.status(400).json({ message: 'Jumlah pembelian tidak valid.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    if (product.stockKg < qty) {
      return res.status(400).json({ message: 'Stok tidak mencukupi untuk pembelian ini' });
    }

    // Kurangi stok
    product.stockKg -= qty;
    await product.save();

    // Simpan riwayat pembelian
    await new Purchase({
      product: product._id,
      qty,
      totalPrice: qty * product.pricePerKg,
    }).save();

    const populated = await Product.findById(product._id).populate('brand', 'name');

    res.status(200).json({ message: 'Pembelian berhasil', product: populated });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    buyProduct
};