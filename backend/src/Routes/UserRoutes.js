// File: routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");

// Standard CRUD routes
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

// Custom routes
router.post("/register", userController.register);

module.exports = router;
