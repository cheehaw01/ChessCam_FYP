const pool = require("../database/pool");

/**
 * Retrieves all player records from the database and sends a JSON response.
 *
 * @async
 * @function
 * @name getAllPlayers
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllPlayers = async (req, res) => {
  try {
    // Query the database to retrieve all players
    const [rows, fields] = await pool.query(`SELECT * FROM player`);

    // Log the retrieved data
    // console.log(rows);

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
 * Creates a new player record in the database and sends a JSON response
 * with the created player data.
 *
 * @async
 * @function
 * @name createPlayer
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const createPlayer = async (req, res) => {
  try {
    // Destructure relevant details from the request body
    const { player_name, win_count, lose_count } = req.body;

    // Insert a new player record into the database
    const [result] = await pool.query(
      `INSERT INTO player(player_name, win_count, lose_count) values(?,?,?)`,
      [player_name, win_count, lose_count]
    );

    // Retrieve the ID of the newly created player
    const id = result.insertId;

    // Retrieve detailed information about the created player based on the ID
    const [rows, fields] = await pool.query(
      `SELECT * FROM player WHERE player_id = ?`,
      [id]
    );

    // Return a success response with the created player data
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
 * Retrieves a specific player record from the database
 * based on the provided player ID and sends a JSON response.
 *
 * @async
 * @function
 * @name getPlayer
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getPlayer = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Query the database to retrieve information about the specified player
    const [rows, fields] = await pool.query(
      `SELECT * FROM player WHERE player_id = ?`,
      [id]
    );

    // Check if data for the specified player ID is found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the retrieved player details
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
 * Updates information about a specific player based on the provided player ID.
 *
 * @async
 * @function
 * @name updatePlayer
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const updatePlayer = async (req, res) => {
  try {
    // Destructure relevant details from the request body and parameters
    const { player_name, win_count, lose_count } = req.body;
    const { id } = req.params;

    // Update the player information in the database based on the provided player ID
    const [result] = await pool.query(
      `UPDATE player SET player_name = ?, win_count = ?, lose_count = ? WHERE player_id = ?`,
      [player_name, win_count, lose_count, id]
    );

    // Retrieve the updated player details from the database
    const [rows, fields] = await pool.query(
      `SELECT * FROM player WHERE player_id = ?`,
      [id]
    );

    // Check if data for the specified player ID is not found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the updated player details
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
 * Deletes a specific player based on the provided player ID from the database.
 *
 * @async
 * @function
 * @name deletePlayer
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const deletePlayer = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Delete the player from the database based on the provided player ID
    const [result] = await pool.query(
      `DELETE FROM player WHERE player_id = ?`,
      [id]
    );

    // Return a success response with information about the deleted player
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

/**
 * Retrieves all player records from the database and sends a ranking JSON response.
 *
 * @async
 * @function
 * @name getTopTenPlayers
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getTopTenPlayers = async (req, res) => {
  try {
    // Query the database to retrieve all players
    const [rows, fields] = await pool.query(`SELECT * FROM player`);

    // Log the retrieved data
    // console.log(rows);

    // Calculate winning rate
    const player_win_rate = rows.map((item) => {
      return {
        player_id: item.player_id,
        player_name: item.player_name,
        win_rate: (item.win_count / (item.win_count + item.lose_count)) * 100,
      };
    });

    // sorting function
    const compareWinRate = (a, b) => {
      return b.win_rate - a.win_rate;
    };

    // sort players in descending order
    const sorted_win_rate = player_win_rate.sort(compareWinRate);

    let topten = sorted_win_rate;

    // take only 10 players if more than 10
    if (sorted_win_rate.length > 10) {
      topten = sorted_win_rate.slice(0, 10);
    }

    // Return a success response with the retrieved data
    return res.status(200).json({
      success: 1,
      data: topten,
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
  getAllPlayers,
  createPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getTopTenPlayers,
};
