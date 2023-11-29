const express = require("express");
const router = express.Router();

// Import the venue controller functions
const {
  getAllVenues,
  createVenue,
  getVenue,
  updateVenue,
  deleteVenue,
} = require("../controllers/venues");

// Define routes for handling venue-related operations
router.route("/").get(getAllVenues).post(createVenue);
router.route("/:id").get(getVenue).patch(updateVenue).delete(deleteVenue);

module.exports = router;
