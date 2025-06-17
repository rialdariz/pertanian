// File: controllers/UserController.js
const BaseController = require("./BaseController");
const User = require("./Models/User");

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  // Tambahkan method khusus untuk User
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Create user
      const user = await this.model.create({
        name,
        email,
        password,
      });

      // Create token
      const token = user.generateAuthToken();

      res.status(201).json({
        success: true,
        token,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
