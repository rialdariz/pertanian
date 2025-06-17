const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Skema MongoDB untuk Benih
const benihSchema = new mongoose.Schema(
  {
    nama: String,
    deskripsi: String,
    harga: Number,
    stok: Number,
    gambar: String,
    // tambahkan field lainnya sesuai kebutuhan
  },
  { timestamps: true }
);

const Benih = mongoose.model("Benih", benihSchema);

// Resource untuk menampilkan data benih
class BenihResource {
  constructor(benih) {
    this.benih = benih;
  }

  toArray() {
    return {
      id: this.benih._id,
      nama: this.benih.nama,
      deskripsi: this.benih.deskripsi,
      harga: this.benih.harga,
      stok: this.benih.stok,
      gambar: this.benih.gambar,
      dibuat_pada: this.benih.createdAt,
      diperbarui_pada: this.benih.updatedAt,
      // tambahkan field lainnya sesuai kebutuhan
    };
  }
}

// Endpoint API
router.get("/benihs", async (req, res) => {
  try {
    const benihs = await Benih.find();
    const response = benihs.map((benih) => new BenihResource(benih).toArray());
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data benih" });
  }
});

router.get("/benihs/:id", async (req, res) => {
  try {
    const benih = await Benih.findById(req.params.id);
    if (!benih) {
      return res.status(404).json({ error: "Benih tidak ditemukan" });
    }
    res.json(new BenihResource(benih).toArray());
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil detail benih" });
  }
});

module.exports = router;
