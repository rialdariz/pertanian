const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ({
    name: { type: String, required: true },
    description: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    pricePerKg: { type: Number, required: true },
    stockKg: { type: Number, default: 0 },
    type: { type: String, enum: ['Hibrida', 'Lokal'], required: true },
    image: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);