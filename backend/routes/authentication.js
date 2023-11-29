const express = require("express");
const router = express.Router();

// Import the authentication controller functions
const {
  verifyUser,
  register,
  login,
  logout,
} = require("../controllers/authentication");

// Define routes for handling authentication related operations
router.route("/").get(verifyUser);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
