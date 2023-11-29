const express = require("express");
const router = express.Router();

// Import the record position controller functions
const {
  createRecordPosition,
  getRecordPosition,
  updateRecordPosition,
  deleteRecordPosition,
} = require("../controllers/record_positions");

// Define routes for handling record position-related operations
router
  .route("/:id")
  .post(createRecordPosition)
  .get(getRecordPosition)
  .patch(updateRecordPosition)
  .delete(deleteRecordPosition);

module.exports = router;
