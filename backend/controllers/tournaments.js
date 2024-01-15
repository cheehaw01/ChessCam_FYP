const pool = require("../database/pool");

/**
 * Retrieves all tournament records from the database and sends a JSON response.
 *
 * @async
 * @function
 * @name getAllTournaments
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllTournaments = async (req, res) => {
  try {
    // Query the database to retrieve all tournaments
    const [rows, fields] = await pool.query(`SELECT * FROM tournament`);

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
 * Creates a new tournament record in the database and sends a JSON response
 * with the created tournament data.
 *
 * @async
 * @function
 * @name createTournament
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const createTournament = async (req, res) => {
  try {
    // Destructure relevant details from the request body
    const { tournament_name } = req.body;

    // Insert a new tournament record into the database
    const [result] = await pool.query(
      `INSERT INTO tournament(tournament_name) values(?)`,
      [tournament_name]
    );

    // Retrieve the ID of the newly created tournament
    const id = result.insertId;

    // Retrieve detailed information about the created tournament based on the ID
    const [rows, fields] = await pool.query(
      `SELECT tournament_id, tournament_name FROM tournament WHERE tournament_id = ?`,
      [id]
    );

    // Return a success response with the created tournament data
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
 * Retrieves a specific tournament record from the database
 * based on the provided tournament ID and sends a JSON response.
 *
 * @async
 * @function
 * @name getTournament
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getTournament = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Query the database to retrieve information about the specified tournament
    const [rows, fields] = await pool.query(
      `SELECT * FROM tournament WHERE tournament_id = ?`,
      [id]
    );

    // Check if data for the specified tournament ID is found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the retrieved tournament details
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
 * Updates information about a specific tournament based on the provided tournament ID.
 *
 * @async
 * @function
 * @name updateTournament
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const updateTournament = async (req, res) => {
  try {
    // Destructure relevant details from the request body and parameters
    const { tournament_name } = req.body;
    const { id } = req.params;

    // Update the tournament information in the database based on the provided tournament ID
    const [result] = await pool.query(
      `UPDATE tournament SET tournament_name = ? WHERE tournament_id = ?`,
      [tournament_name, id]
    );

    // Retrieve the updated tournament details from the database
    const [rows, fields] = await pool.query(
      `SELECT * FROM tournament WHERE tournament_id = ?`,
      [id]
    );

    // Check if data for the specified tournament ID is not found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the updated tournament details
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
 * Deletes a specific tournament based on the provided tournament ID from the database.
 *
 * @async
 * @function
 * @name deleteTournament
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const deleteTournament = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Delete the tournament from the database based on the provided tournament ID
    const [result] = await pool.query(
      `DELETE FROM tournament WHERE tournament_id = ?`,
      [id]
    );

    // Return a success response with information about the deleted tournament
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
  getAllTournaments,
  createTournament,
  getTournament,
  updateTournament,
  deleteTournament,
};
