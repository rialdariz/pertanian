const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama kategori harus diisi"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    photo: {
      type: String,
      required: [true, "Foto kategori harus diisi"],
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: (props) => `${props.value} bukan format gambar yang valid!`,
      },
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
CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
      locale: "id", // Optimasi untuk bahasa Indonesia
    });
  }
  next();
});

// Relasi virtual untuk semua benih
CategorySchema.virtual("benihs", {
  ref: "Benihs",
  localField: "_id",
  foreignField: "category_id",
  options: {
    sort: { createdAt: -1 }, // Urutkan dari yang terbaru
  },
});

// Relasi virtual untuk benih popular
CategorySchema.virtual("popularBenihs", {
  ref: "Benihs",
  localField: "_id",
  foreignField: "category_id",
  match: { is_popular: true },
  options: {
    sort: { createdAt: -1 },
    limit: 8, // Batasi 8 benih popular per kategori
  },
});

// Plugin untuk soft delete
CategorySchema.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: ["count", "countDocuments", "find"],
});

// Index untuk optimasi query
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: "text" });

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
