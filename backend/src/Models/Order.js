const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantityKg: { type: Number, required: true },
    pricePerKg: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['transfer', 'e-wallet', 'cod'], 
    default: 'cod' 
  },
  shippingAddress: String,
  trackingNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
