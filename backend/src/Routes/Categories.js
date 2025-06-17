const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Route: GET /api/v1/categories
router.get("/", categoryController.index);

// Route: GET /api/v1/categories/:id
router.get("/:id", categoryController.show); // Opsional, jika kamu punya method 'show'

module.exports = router;
