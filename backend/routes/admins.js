const express = require("express");
const router = express.Router();

// Import the admin controller functions
const {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admins");

// Define routes for handling admin-related operations
router.route("/").get(getAllAdmins);
router.route("/:id").get(getAdmin).patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
