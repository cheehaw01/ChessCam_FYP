const express = require("express");
const router = express.Router();

// Import the live_interaction controller functions
const {
  createLiveInteraction,
  getLiveInteraction,
  updateLiveInteraction,
} = require("../controllers/live_interaction");

// Define routes for handling live interaction-related operations
router
  .route("/")
  .get(getLiveInteraction)
  .post(createLiveInteraction)
  .patch(updateLiveInteraction);

module.exports = router;
