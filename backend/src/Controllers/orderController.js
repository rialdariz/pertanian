const Order = require('../models/Order');
const Product = require('../models/Product'); // Diperlukan untuk update stok
const User = require('../models/User');       // Diperlukan untuk mengambil data customer

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User yang login)
const createOrder = async (req, res) => {
    try {
        const { items, paymentMethod, shippingAddress } = req.body;
        const customerId = req.user.id; // Didapat dari middleware 'protect'

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        let calculatedTotalPrice = 0;
        const processedItems = [];

        // Loop untuk memvalidasi setiap item dan menghitung total harga
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stockKg < item.quantityKg) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            const priceForThisItem = product.pricePerKg * item.quantityKg;
            calculatedTotalPrice += priceForThisItem;

            processedItems.push({
                product: item.product,
                quantityKg: item.quantityKg,
                pricePerKg: product.pricePerKg, // Gunakan harga dari database, bukan dari client
            });
        }

        // Buat pesanan baru
        const order = new Order({
            customer: customerId,
            items: processedItems,
            totalPrice: calculatedTotalPrice,
            paymentMethod,
            shippingAddress,
        });

        const createdOrder = await order.save();

        // Kurangi stok produk setelah pesanan berhasil dibuat
        for (const item of createdOrder.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockKg: -item.quantityKg }
            });
        }

        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('items.product', 'name imageUrl') // Ambil detail produk
            .sort({ createdAt: -1 }); // Tampilkan yang terbaru dulu

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email') // Ambil detail pelanggan
            .populate('items.product', 'name imageUrl'); // Ambil detail produk

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Pastikan hanya pemilik pesanan atau admin yang bisa melihat
        if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// --- Admin Controllers ---

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = {};
        if(status) filter.status = status;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const orders = await Order.find(filter)
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalOrders = await Order.countDocuments(filter);

        res.status(200).json({
            data: orders,
            pagination: {
                total: totalOrders,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalOrders / limitNum),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update order status (e.g., to shipped, delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status || order.status;
        if(trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        // Logika tambahan jika status diubah menjadi 'cancelled', stok harus dikembalikan
        if (status === 'cancelled' && order.status !== 'cancelled') {
             for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stockKg: +item.quantityKg }
                });
            }
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};