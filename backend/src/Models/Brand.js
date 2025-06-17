const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");
const slugify = require("slugify");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama brand harus diisi"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
      required: [true, "Foto brand harus diisi"],
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif)$/i.test(v);
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
BrandSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }
  next();
});

// Relasi virtual untuk semua benih
BrandSchema.virtual("benihs", {
  ref: "Benihs",
  localField: "_id",
  foreignField: "brand_id",
});

// Relasi virtual untuk benih popular
BrandSchema.virtual("popularBenihs", {
  ref: "Benihs",
  localField: "_id",
  foreignField: "brand_id",
  match: { is_popular: true },
  options: { sort: { createdAt: -1 } },
});

// Plugin untuk soft delete
BrandSchema.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: true,
});

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;
