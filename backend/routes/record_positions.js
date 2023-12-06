const express = require("express");
const router = express.Router();

// Import the record position controller functions
const {
  createRecordPosition,
  getRecordPosition,
  updateRecordPosition,
  deleteRecordPosition,
  getRecordTime,
} = require("../controllers/record_positions");

// Define routes for handling record position-related operations
router
  .route("/:id")
  .post(createRecordPosition)
  .get(getRecordPosition)
  .patch(updateRecordPosition)
  .delete(deleteRecordPosition);
router.route("/time/:id").get(getRecordTime);

module.exports = router;
