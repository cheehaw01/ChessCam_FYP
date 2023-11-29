const express = require("express");
const router = express.Router();

// Import the tournament controller functions
const {
  getAllTournaments,
  createTournament,
  getTournament,
  updateTournament,
  deleteTournament,
} = require("../controllers/tournaments");

// Define routes for handling tournament-related operations
router.route("/").get(getAllTournaments).post(createTournament);
router
  .route("/:id")
  .get(getTournament)
  .patch(updateTournament)
  .delete(deleteTournament);

module.exports = router;
