const express = require("express");
const router = express.Router();
const bookingTransactionController = require("../controllers/bookingTransactionController");

// Route: POST /api/v1/booking-transactions
router.post("/", bookingTransactionController.store);

// Route: POST /api/v1/booking-transactions/details
router.post("/details", bookingTransactionController.bookingDetails);

module.exports = router;
