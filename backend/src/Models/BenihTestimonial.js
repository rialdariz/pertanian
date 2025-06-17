const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");

const BenihTestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama testimonial harus diisi"],
    },
    message: {
      type: String,
      required: [true, "Pesan testimonial harus diisi"],
    },
    photo: {
      type: String,
      required: [true, "Foto testimonial harus diisi"],
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: (props) => `${props.value} bukan format gambar yang valid!`,
      },
    },
    rating: {
      type: Number,
      required: [true, "Rating harus diisi"],
      min: [1, "Rating minimal 1"],
      max: [5, "Rating maksimal 5"],
    },
    benih_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Benihs",
      required: [true, "ID Benih harus diisi"],
    },
    dihapusPada: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Relasi ke model Benihs
BenihTestimonialSchema.virtual("benih", {
  ref: "Benihs",
  localField: "benih_id",
  foreignField: "_id",
  justOne: true,
});

// Plugin untuk soft delete
BenihTestimonialSchema.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: true,
});

const BenihTestimonial = mongoose.model(
  "BenihTestimonial",
  BenihTestimonialSchema
);

module.exports = BenihTestimonial;
