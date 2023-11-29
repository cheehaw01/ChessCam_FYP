const express = require("express");
const router = express.Router();

// Import the live move controller functions
const {
  getAllLiveMoves,
  createLiveMove,
  getLiveMove,
  updateLiveMove,
  deleteLiveMove,
  deleteAllLiveMoves,
} = require("../controllers/live_moves");

// Define routes for handling live move-related operations
router
  .route("/")
  .get(getAllLiveMoves)
  .post(createLiveMove)
  .delete(deleteAllLiveMoves);
router
  .route("/:index")
  .get(getLiveMove)
  .patch(updateLiveMove)
  .delete(deleteLiveMove);

module.exports = router;
