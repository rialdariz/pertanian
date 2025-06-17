const express = require("express");
const router = express.Router();
const benihsController = require("../controllers/benihsController");

// Route: GET /api/v1/benihs
router.get("/", benihsController.index);

// Route: GET /api/v1/benihs/:id
router.get("/:id", benihsController.show);

// Route: GET /api/v1/benihs/slug/:slug
router.get("/slug/:slug", benihsController.showBySlug);

module.exports = router;
