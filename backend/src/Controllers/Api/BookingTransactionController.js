const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const BookingTransaction = require("../models/BookingTransaction");
const Benihs = require("../models/Benihs");
const BookingTransactionApiResource = require("../Resources/BookingTransactionApiResource");

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/proof/");
  },
  filename: function (req, file, cb) {
    cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diperbolehkan!"));
    }
  },
}).single("proof");

// @desc    Create new booking transaction
// @route   POST /api/v1/booking-transactions
// @access  Public
exports.store = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      const { name, phone, email, post_code, city, address, benih_ids } =
        req.body;

      // Validasi input
      if (
        !name ||
        !phone ||
        !email ||
        !post_code ||
        !city ||
        !address ||
        !benih_ids
      ) {
        return res.status(400).json({
          success: false,
          message: "Semua field harus diisi",
        });
      }

      // Parse benih_ids
      let products;
      try {
        products = JSON.parse(benih_ids);
      } catch (e) {
        return res.status(422).json({
          success: false,
          message: "Format benih_ids tidak valid",
        });
      }

      if (!Array.isArray(products)) {
        return res.status(422).json({
          success: false,
          message: "benih_ids harus berupa array",
        });
      }

      // Hitung total quantity dan price
      let totalQuantity = 0;
      let totalPrice = 0;
      const benihsIds = products.map((item) => item.id);

      const benihs = await Benihs.find({ _id: { $in: benihsIds } });

      for (const item of products) {
        const benih = benihs.find((b) => b._id.toString() === item.id);
        if (!benih) continue;

        totalQuantity += parseInt(item.quantity);
        totalPrice += benih.price * parseInt(item.quantity);
      }

      const tax = 0.11 * totalPrice;
      const grandTotal = totalPrice + tax;

      // Buat booking transaction
      const bookingData = {
        name,
        phone,
        email,
        post_code,
        city,
        address,
        proof: req.file ? `/uploads/proof/${req.file.filename}` : null,
        total_amount: grandTotal,
        total_tax_amount: tax,
        sub_total_amount: totalPrice,
        is_paid: false,
        booking_trx_id: await BookingTransaction.generateUniqueTrxId(),
        quantity: totalQuantity,
      };

      const bookingTransaction = await BookingTransaction.create(bookingData);

      // Buat transaction details
      const transactionDetails = [];
      for (const item of products) {
        const benih = benihs.find((b) => b._id.toString() === item.id);
        if (!benih) continue;

        transactionDetails.push({
          booking_transaction_id: bookingTransaction._id,
          benih_id: item.id,
          quantity: item.quantity,
          price: benih.price,
        });
      }

      // Simpan transaction details (asumsi ada model TransactionDetails)
      await TransactionDetails.insertMany(transactionDetails);

      // Populate data untuk response
      const populatedBooking = await BookingTransaction.findById(
        bookingTransaction._id
      ).populate({
        path: "transactionDetails",
        populate: {
          path: "benih_id",
          model: "Benihs",
        },
      });

      res.status(201).json({
        success: true,
        data: new BookingTransactionApiResource(populatedBooking),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
    }
  });
});

// @desc    Get booking details
// @route   POST /api/v1/booking-transactions/details
// @access  Public
exports.bookingDetails = asyncHandler(async (req, res, next) => {
  try {
    const { email, booking_trx_id } = req.body;

    // Validasi input
    if (!email || !booking_trx_id) {
      return res.status(400).json({
        success: false,
        message: "Email dan booking_trx_id harus diisi",
      });
    }

    const booking = await BookingTransaction.findOne({
      email,
      booking_trx_id,
    }).populate({
      path: "transactionDetails",
      populate: {
        path: "benih_id",
        model: "Benihs",
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: new BookingTransactionApiResource(booking),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
});
