const express = require("express");
const router = express.Router();

// Import the pair controller functions
const {
  getAllPairs,
  createPair,
  getPair,
  updatePair,
  deletePair,
} = require("../controllers/pairs");

// Define routes for handling pair-related operations
router.route("/").get(getAllPairs).post(createPair);
router.route("/:id").get(getPair).patch(updatePair).delete(deletePair);

module.exports = router;
