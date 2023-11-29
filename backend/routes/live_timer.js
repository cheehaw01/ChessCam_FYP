const express = require("express");
const router = express.Router();

// Import the live timer controller functions
const {
  createTimerStatus,
  getTimerStatus,
  updateTimerStatus,
  deleteTimerStatus,
} = require("../controllers/live_timer");

// Define routes for handling live timer-related operations
router
  .route("/")
  .get(getTimerStatus)
  .post(createTimerStatus)
  .delete(deleteTimerStatus);
router.route("/:turn").post(updateTimerStatus);

module.exports = router;
