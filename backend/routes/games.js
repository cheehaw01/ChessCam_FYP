const express = require("express");
const router = express.Router();

// Import the game controller functions
const {
  getAllGamesRaw,
  getAllGames,
  createGame,
  getGame,
  updateGame,
  deleteGame,
} = require("../controllers/games");

// Define routes for handling game related operations
router.route("/").get(getAllGames).post(createGame);
router.route("/raw").get(getAllGamesRaw);
router.route("/:id").get(getGame).patch(updateGame).delete(deleteGame);

module.exports = router;
