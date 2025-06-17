const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");

const BookingTransactionSchema = new mongoose.Schema(
  {
    booking_trx_id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    phone: {
      type: String,
      required: [true, "Nomor telepon harus diisi"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10,13}$/.test(v);
        },
        message: (props) => `${props.value} bukan nomor telepon yang valid!`,
      },
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} bukan email yang valid!`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Jumlah harus diisi"],
      min: [1, "Jumlah minimal 1"],
    },
    proof: {
      type: String,
      required: [true, "Bukti pembayaran harus diupload"],
    },
    post_code: {
      type: String,
      required: [true, "Kode pos harus diisi"],
    },
    city: {
      type: String,
      required: [true, "Kota harus diisi"],
    },
    address: {
      type: String,
      required: [true, "Alamat harus diisi"],
    },
    sub_total_amount: {
      type: Number,
      required: [true, "Sub total harus diisi"],
      min: [0, "Sub total tidak boleh negatif"],
    },
    total_amount: {
      type: Number,
      required: [true, "Total amount harus diisi"],
      min: [0, "Total amount tidak boleh negatif"],
    },
    total_tax_amount: {
      type: Number,
      required: [true, "Total pajak harus diisi"],
      min: [0, "Total pajak tidak boleh negatif"],
    },
    is_paid: {
      type: Boolean,
      default: false,
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

// Fungsi untuk generate unique transaction ID
BookingTransactionSchema.statics.generateUniqueTrxId = async function () {
  const prefix = "Rialda";
  let randomString;
  let isUnique = false;

  while (!isUnique) {
    randomString = prefix + Math.floor(1000 + Math.random() * 9000);
    const exists = await this.findOne({ booking_trx_id: randomString });
    isUnique = !exists;
  }

  return randomString;
};

// Middleware untuk generate ID sebelum menyimpan
BookingTransactionSchema.pre("save", async function (next) {
  if (!this.booking_trx_id) {
    this.booking_trx_id = await this.constructor.generateUniqueTrxId();
  }
  next();
});

// Relasi virtual untuk transaction details
BookingTransactionSchema.virtual("transactionDetails", {
  ref: "TransactionDetails",
  localField: "_id",
  foreignField: "bookingTransaction_id",
});

// Plugin untuk soft delete
BookingTransactionSchema.plugin(softDelete, {
  deletedAt: "dihapusPada",
  overrideMethods: true,
});

const BookingTransaction = mongoose.model(
  "BookingTransaction",
  BookingTransactionSchema
);

module.exports = BookingTransaction;
