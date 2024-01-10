const express = require("express");
const router = express.Router();

// Import the game controller functions
const {
  createImage,
  getCaptureImgInstruction,
  createCaptureImgInstruction,
  updateCaptureImgInstruction,
} = require("../controllers/camera");

// Define routes for handling game related operations
router.route("/").post(createImage);
router
  .route("/image")
  .get(getCaptureImgInstruction)
  .post(createCaptureImgInstruction);
router.route("/image/:capture").patch(updateCaptureImgInstruction);

module.exports = router;
