const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Skema MongoDB untuk Transaksi Booking
const bookingTransactionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    benih_id: { type: mongoose.Schema.Types.ObjectId, ref: "Benih" },
    jumlah: Number,
    total_harga: Number,
    status: {
      type: String,
      enum: ["pending", "diproses", "selesai", "dibatalkan"],
      default: "pending",
    },
    metode_pembayaran: String,
    bukti_pembayaran: String,
    tanggal_booking: Date,
    // tambahkan field lainnya sesuai kebutuhan
  },
  { timestamps: true }
);

const BookingTransaction = mongoose.model(
  "BookingTransaction",
  bookingTransactionSchema
);

// Resource untuk menampilkan data transaksi booking
class BookingTransactionResource {
  constructor(transaction) {
    this.transaction = transaction;
  }

  async toArray() {
    // Populate data user dan benih jika diperlukan
    await this.transaction.populate("user_id", "nama email");
    await this.transaction.populate("benih_id", "nama harga");

    return {
      id: this.transaction._id,
      user: {
        id: this.transaction.user_id._id,
        nama: this.transaction.user_id.nama,
        email: this.transaction.user_id.email,
      },
      benih: {
        id: this.transaction.benih_id._id,
        nama: this.transaction.benih_id.nama,
        harga: this.transaction.benih_id.harga,
      },
      jumlah: this.transaction.jumlah,
      total_harga: this.transaction.total_harga,
      status: this.transaction.status,
      metode_pembayaran: this.transaction.metode_pembayaran,
      bukti_pembayaran: this.transaction.bukti_pembayaran,
      tanggal_booking: this.transaction.tanggal_booking,
      dibuat_pada: this.transaction.createdAt,
      diperbarui_pada: this.transaction.updatedAt,
      // tambahkan field lainnya sesuai kebutuhan
    };
  }
}

// Endpoint API
router.get("/booking-transactions", async (req, res) => {
  try {
    const transactions = await BookingTransaction.find();
    const resources = await Promise.all(
      transactions.map((t) => new BookingTransactionResource(t).toArray())
    );
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data transaksi booking" });
  }
});

router.get("/booking-transactions/:id", async (req, res) => {
  try {
    const transaction = await BookingTransaction.findById(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Transaksi booking tidak ditemukan" });
    }
    const resource = await new BookingTransactionResource(
      transaction
    ).toArray();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil detail transaksi booking" });
  }
});

module.exports = router;
