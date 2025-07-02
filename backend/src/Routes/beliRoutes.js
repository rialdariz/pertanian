// routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const { getAllPurchases } = require('../controllers/beliController');

router.get('/', getAllPurchases); // GET /api/purchases

module.exports = router;
