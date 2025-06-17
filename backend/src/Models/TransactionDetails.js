const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");

const TransactionDetailsSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: [true, "Harga harus diisi"],
      min: [0, "Harga tidak boleh negatif"],
    },
    quantity: {
      type: Number,
      required: [true, "Jumlah harus diisi"],
      min: [1, "Jumlah minimal 1"],
    },
    benih_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Benihs",
      required: [true, "Benih harus dipilih"],
    },
    booking_transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingTransaction",
      required: [true, "Transaksi booking harus dipilih"],
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

// Relasi virtual ke BookingTransaction
TransactionDetailsSchema.virtual("bookingTransaction", {
  ref: "BookingTransaction",
  localField: "booking_transaction_id",
  foreignField: "_id",
  justOne: true,
});

// Relasi virtual ke Benih
TransactionDetailsSchema.virtual("benih", {
  ref: "Benihs",
  localField: "benih_id",
  foreignField: "_id",
  justOne: true,
});

// Plugin untuk soft delete
TransactionDetailsSchema.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: true,
});

// Middleware untuk auto-populate
TransactionDetailsSchema.pre("find", function () {
  this.populate("benih bookingTransaction");
});

TransactionDetailsSchema.pre("findOne", function () {
  this.populate("benih bookingTransaction");
});

const TransactionDetails = mongoose.model(
  "TransactionDetails",
  TransactionDetailsSchema
);

module.exports = TransactionDetails;
