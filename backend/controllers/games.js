const pool = require("../database/pool");

/**
 * Retrieves all games from the database without any additional processing.
 *
 * @async
 * @function
 * @name getAllGamesRaw
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllGamesRaw = async (req, res) => {
  try {
    // Query the database to retrieve all games
    const [rows, fields] = await pool.query(`SELECT * FROM game`);

    // Log the retrieved data
    console.log(rows);

    // Return a success response with the retrieved data
    return res.status(200).json({
      success: 1,
      data: rows,
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * Retrieves detailed information about all games, including tournament, venue, players, and results.
 *
 * @async
 * @function
 * @name getAllGames
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllGames = async (req, res) => {
  try {
    // Query the database to retrieve detailed information about all games
    const [rows, fields] = await pool.query(
      `SELECT g.game_id, g.tournament_id, t.tournament_name, g.venue_id, v.venue_name, g.date, white.player_name AS white_player, black.player_name AS black_player, g.winning_side
    FROM game g, tournament t, venue v,
    (SELECT pair.game_id, pair.player_id, player.player_name
    FROM pair
    INNER JOIN player ON pair.player_id = player.player_id
    WHERE pair.side='white') white,
    (SELECT pair.game_id, pair.player_id, player.player_name
    FROM pair
    INNER JOIN player ON pair.player_id = player.player_id
    WHERE pair.side='black') black
    WHERE g.tournament_id=t.tournament_id
    AND g.venue_id=v.venue_id
    AND g.game_id=white.game_id
    AND g.game_id=black.game_id
    ORDER BY g.game_id`
    );

    // Log the retrieved data
    console.log(rows);

    // Return a success response with the retrieved data
    return res.status(200).json({
      success: 1,
      data: rows,
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * Creates a new game entry in the database with the provided details.
 *
 * @async
 * @function
 * @name createGame
 * @kind variable
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const createGame = async (req, res) => {
  try {
    // Destructure relevant details from the request body
    const { tournament_id, venue_id, date, winning_side } = req.body;

    // Insert a new game entry into the database
    const [result] = await pool.query(
      `INSERT INTO game(tournament_id, venue_id, date, winning_side) values(?,?,?,?)`,
      [tournament_id, venue_id, date, winning_side]
    );

    // Retrieve the ID of the newly created game entry
    const id = result.insertId;

    // Retrieve detailed information about the created game
    const [rows, fields] = await pool.query(
      `SELECT game_id, tournament_id, venue_id, date, winning_side FROM game WHERE game_id = ?`,
      [id]
    );

    // Return a success response with the created game details
    return res.status(201).json({
      success: 1,
      data: rows[0],
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * Retrieves information about a specific game based on the provided game ID.
 *
 * @async
 * @function
 * @name getGame
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getGame = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Query the database to retrieve information about the specified game
    const [rows, fields] = await pool.query(
      `SELECT game_id, tournament_id, venue_id, date, winning_side FROM game WHERE game_id = ?`,
      [id]
    );

    // Check if data for the specified game ID is found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the retrieved game details
    return res.status(200).json({
      success: 1,
      data: rows[0],
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * Updates information about a specific game based on the provided game ID.
 *
 * @async
 * @function
 * @name updateGame
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const updateGame = async (req, res) => {
  try {
    // Destructure relevant details from the request body and parameters
    const { tournament_id, venue_id, date, winning_side } = req.body;
    const { id } = req.params;

    // Update the game information in the database based on the provided game ID
    const [result] = await pool.query(
      `UPDATE game SET tournament_id = ?, venue_id = ?, date = ?, winning_side = ? WHERE game_id = ?`,
      [tournament_id, venue_id, date, winning_side, id]
    );

    // Retrieve the updated game details from the database
    const [rows, fields] = await pool.query(
      `SELECT game_id, tournament_id, venue_id, date, winning_side FROM game WHERE game_id = ?`,
      [id]
    );

    // Check if data for the specified game ID is not found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the updated game details
    return res.status(200).json({
      success: 1,
      data: rows[0],
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * Deletes a specific game based on the provided game ID from the database.
 *
 * @async
 * @function
 * @name deleteGame
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const deleteGame = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Delete the game from the database based on the provided game ID
    const [result] = await pool.query(`DELETE FROM game WHERE game_id = ?`, [
      id,
    ]);

    // Return a success response with information about the deleted game
    return res.status(200).json({
      success: 1,
      deletedId: id,
      affectedRow: result.affectedRows,
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

module.exports = {
  getAllGamesRaw,
  getAllGames,
  createGame,
  getGame,
  updateGame,
  deleteGame,
};
