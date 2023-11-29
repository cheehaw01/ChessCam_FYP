const pool = require("../database/pool");

/**
 * Retrieves all games from the database without any additional processing.
 *
 * @async
 * @function
 * @name getAllPairs
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllPairs = async (req, res) => {
  try {
    // Query the database to retrieve all games
    const [rows, fields] = await pool.query(`SELECT * FROM pair`);

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
 * Creates a pair by associating a player with a game and specifying the player's side.
 *
 * @async
 * @function
 * @name createPair
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const createPair = async (req, res) => {
  try {
    // Destructure relevant details from the request body
    const { game_id, player_id, side } = req.body;

    // Check the current number of players associated with the game
    const [rows_pre, fields_pre] = await pool.query(
      `SELECT * FROM pair WHERE game_id = ?`,
      [game_id]
    );

    // Check if adding more players would exceed the limit of 2 players per game
    if (rows_pre.length >= 2) {
      return res.status(200).json({
        success: 0,
        message: "Cannot add or create more than 2 players for a single game.",
      });
    }

    // Check if the player with the same side already exists for the game
    if (rows_pre.length > 0 && rows_pre[0].side === side) {
      return res.status(200).json({
        success: 0,
        message: "Cannot add or create player with same side.",
      });
    }

    // Insert the new pair into the database
    const [result] = await pool.query(
      `INSERT INTO pair(game_id, player_id, side) values(?,?,?)`,
      [game_id, player_id, side]
    );

    // Retrieve the ID of the newly created pair
    const id = result.insertId;

    // Retrieve information about all pairs associated with the game
    const [rows, fields] = await pool.query(
      `SELECT * FROM pair WHERE game_id = ?`,
      [game_id]
    );

    // Log the retrieved pairs
    console.log(rows);

    // Return a success response with information about the created pair(s)
    return res.status(201).json({
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
 * Retrieves information about a specific pair based on the provided pair ID.
 *
 * @async
 * @function
 * @name getPair
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getPair = async (req, res) => {
  try {
    // Destructure the 'id' parameter from the request parameters
    const { id } = req.params;

    // Query the database to retrieve information about the specified pair
    const [rows, fields] = await pool.query(
      `SELECT * FROM pair WHERE game_id = ?`,
      [id]
    );

    // Check if data for the specified pair ID is found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the retrieved pair details
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
 * Updates information about a specific pair based on the provided pair ID.
 *
 * @async
 * @function
 * @name updatePair
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const updatePair = async (req, res) => {
  try {
    // Destructure relevant details from the request body and parameters
    const { player_id, new_player_id } = req.body;
    const { id } = req.params;

    // Update the pair information in the database based on the provided pair ID
    const [result] = await pool.query(
      `UPDATE pair SET player_id = ? WHERE game_id = ? AND player_id = ?`,
      [new_player_id, id, player_id]
    );

    // Retrieve the updated pair details from the database
    const [rows, fields] = await pool.query(
      `SELECT * FROM pair WHERE game_id = ?`,
      [id]
    );

    // Check if data for the specified pair ID is not found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Log the retrieved data
    console.log(rows);

    // Return a success response with the updated pair details
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
 * Deletes a player from a specific game's pairings based on the provided game ID and player ID.
 *
 * @async
 * @function
 * @name deletePair
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const deletePair = async (req, res) => {
  try {
    // Destructure relevant details from the request body and parameters
    const { player_id } = req.body;
    const { id } = req.params;

    // Delete the player from the specified game's pairings in the database
    const [result] = await pool.query(
      `DELETE FROM pair WHERE game_id = ? AND player_id = ?`,
      [id, player_id]
    );

    // Check if the deletion was unsuccessful
    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: 0,
        message: "Delete was unsuccessful",
      });
    }

    // Return a success response with information about the deleted pair
    return res.status(200).json({
      success: 1,
      deletedGameId: id,
      deletedPlayerId: player_id,
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
  getAllPairs,
  createPair,
  getPair,
  updatePair,
  deletePair,
};
