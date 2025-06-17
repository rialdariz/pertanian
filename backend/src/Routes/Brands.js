const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

// Route: GET /api/v1/brands
router.get("/", brandController.index);

// Route: GET /api/v1/brands/:id
router.get("/:id", brandController.show);

module.exports = router;
