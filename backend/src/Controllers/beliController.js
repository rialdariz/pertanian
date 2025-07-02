const Purchase = require('../models/Beli');

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('product', 'name pricePerKg')
      .sort({ purchasedAt: -1 });

    res.status(200).json({ data: purchases });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAllPurchases };
