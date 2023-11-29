const express = require("express");
const router = express.Router();

// Import the live position controller functions
const {
  getAllLivePositions,
  createLivePosition,
  getLivePosition,
  updateLivePosition,
  deleteLivePosition,
  deleteAllLivePositions,
} = require("../controllers/live_positions");

// Define routes for handling live position-related operations
router
  .route("/")
  .get(getAllLivePositions)
  .post(createLivePosition)
  .delete(deleteAllLivePositions);
router
  .route("/:index")
  .get(getLivePosition)
  .patch(updateLivePosition)
  .delete(deleteLivePosition);

module.exports = router;
