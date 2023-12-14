const express = require("express");
const router = express.Router();

// Import the input controller functions
const {
  createInputInstruction,
  getInputInstruction,
  updateInputInstruction,
  resetInputInstruction,
} = require("../controllers/input");

// Define routes for handling input-related operations
router
  .route("/")
  .get(getInputInstruction)
  .post(createInputInstruction)
  .delete(resetInputInstruction);
router.route("/:trigger").patch(updateInputInstruction);

module.exports = router;
