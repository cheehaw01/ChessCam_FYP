const express = require("express");
const router = express.Router();

// Import the player controller functions
const {
  getAllPlayers,
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getTopTenPlayers,
} = require("../controllers/players");

// Define routes for handling player-related operations
router.route("/").get(getAllPlayers).post(createPlayer);
router.route("/ranks").get(getTopTenPlayers);
router.route("/:id").get(getPlayer).patch(updatePlayer).delete(deletePlayer);

module.exports = router;
