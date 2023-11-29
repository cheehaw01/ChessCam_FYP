const express = require("express");
const router = express.Router();

// Import the detection controller functions
const {
  callDetectionPyScript,
  killDetectionPyScript,
} = require("../controllers/detection");

// Define routes for handling detection related operations
router.route("/").post(callDetectionPyScript);
router.route("/stop").post(killDetectionPyScript);

module.exports = router;
