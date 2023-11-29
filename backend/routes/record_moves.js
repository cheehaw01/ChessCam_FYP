const express = require("express");
const router = express.Router();

// Import the record move controller functions
const {
  createRecordMove,
  getRecordMove,
  updateRecordMove,
  deleteRecordMove,
} = require("../controllers/record_moves");

// Define routes for handling record move-related operations
router
  .route("/:id")
  .post(createRecordMove)
  .get(getRecordMove)
  .patch(updateRecordMove)
  .delete(deleteRecordMove);

module.exports = router;
