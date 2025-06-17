const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");
const slugify = require("slugify");

const BenihsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama benih harus diisi"],
    },
    slug: {
      type: String,
      unique: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail harus diisi"],
    },
    about: {
      type: String,
      required: [true, "Deskripsi tentang benih harus diisi"],
    },
    price: {
      type: Number,
      required: [true, "Harga harus diisi"],
      min: [0, "Harga tidak boleh negatif"],
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Merk harus dipilih"],
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategori harus dipilih"],
    },
    is_popular: {
      type: Boolean,
      default: false,
    },
    stok: {
      type: Number,
      required: [true, "Stok harus diisi"],
      min: [0, "Stok tidak boleh negatif"],
    },
    dihapusPada: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug sebelum menyimpan
BenihsSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Relasi virtual untuk benefits
BenihsSchema.virtual("benefits", {
  ref: "BenihBenefit",
  localField: "_id",
  foreignField: "benih_id",
});

// Relasi virtual untuk photos
BenihsSchema.virtual("photos", {
  ref: "BenihPhoto",
  localField: "_id",
  foreignField: "benih_id",
});

// Relasi virtual untuk testimonials
BenihsSchema.virtual("testimonials", {
  ref: "BenihTestimonial",
  localField: "_id",
  foreignField: "benih_id",
});

// Plugin untuk soft delete
BenihsSchema.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: true,
});

const Benihs = mongoose.model("Benihs", BenihsSchema);

module.exports = Benihs;
