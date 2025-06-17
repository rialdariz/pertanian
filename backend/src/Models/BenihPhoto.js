const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");

const SkemaBenihPhoto = new mongoose.Schema(
  {
    foto: {
      // sebelumnya 'photo' di Laravel
      type: String, // Diasumsikan menyimpan path/lokasi file
      required: [true, "Foto harus diisi"],
    },
    benih_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Benih", // Referensi ke model Benih
      required: [true, "ID Benih harus diisi"],
    },
    dihapusPada: {
      // untuk soft delete
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Menambahkan createdAt dan updatedAt otomatis
  }
);

// Plugin untuk soft delete
SkemaBenihPhoto.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: true,
});

const BenihPhoto = mongoose.model("BenihPhoto", SkemaBenihPhoto);

module.exports = BenihPhoto;
