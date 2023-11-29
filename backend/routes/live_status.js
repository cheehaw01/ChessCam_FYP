const express = require("express");
const router = express.Router();

// Import the live status controller functions
const {
  createLiveStatus,
  getLiveStatus,
  getPyPid,
  deleteLiveStatus,
} = require("../controllers/live_status");

// Define routes for handling live status-related operations
router
  .route("/")
  .get(getLiveStatus)
  .post(createLiveStatus)
  .delete(deleteLiveStatus);
router.route("/pid").get(getPyPid);

module.exports = router;
