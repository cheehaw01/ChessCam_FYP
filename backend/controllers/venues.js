const pool = require("../database/pool");

/**
 * Retrieves all venue records from the database and sends a JSON response.
 *
 * @async
 * @function
 * @name getAllVenues
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllVenues = async (req, res) => {
  try {
    // Query the database to retrieve all venues
    const [rows, fields] = await pool.query(`SELECT * FROM venue`);

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
 * Creates a new venue record in the database and sends a JSON response
 * with the created venue data.
 *
 * @async
 * @function
 * @name createVenue
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const createVenue = async (req, res) => {
  try {
    // Destructure relevant details from the request body
    const { venue_name } = req.body;

    // Insert a new venue record into the database
    const [result] = await pool.query(
      `INSERT INTO venue(venue_name) values(?)`,
      [venue_name]
    );

    // Retrieve the ID of the newly created venue
    const id = result.insertId;

    // Retrieve detailed information about the created venue based on the ID
    const [rows, fields] = await pool.query(
      `SELECT venue_id, venue_name FROM venue WHERE venue_id = ?`,
      [id]
    );

    // Return a success response with the created venue data
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
 * Retrieves a specific venue record from the database
 * based on the provided venue ID and sends a JSON response.
 *
 * @async
 * @function
 * @name getVenue
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getVenue = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Query the database to retrieve information about the specified venue
    const [rows, fields] = await pool.query(
      `SELECT * FROM venue WHERE venue_id = ?`,
      [id]
    );

    // Check if data for the specified venue ID is found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the retrieved venue details
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
 * Updates information about a specific venue based on the provided venue ID.
 *
 * @async
 * @function
 * @name updateVenue
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const updateVenue = async (req, res) => {
  try {
    // Destructure relevant details from the request body and parameters
    const { venue_name } = req.body;
    const { id } = req.params;

    // Update the venue information in the database based on the provided venue ID
    const [result] = await pool.query(
      `UPDATE venue SET venue_name = ? WHERE venue_id = ?`,
      [venue_name, id]
    );

    // Retrieve the updated venue details from the database
    const [rows, fields] = await pool.query(
      `SELECT * FROM venue WHERE venue_id = ?`,
      [id]
    );

    // Check if data for the specified venue ID is not found
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a success response with the updated venue details
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
 * Deletes a specific venue based on the provided venue ID from the database.
 *
 * @async
 * @function
 * @name deleteVenue
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const deleteVenue = async (req, res) => {
  try {
    // Destructure the 'id' from the request parameters
    const { id } = req.params;

    // Delete the venue from the database based on the provided venue ID
    const [result] = await pool.query(`DELETE FROM venue WHERE venue_id = ?`, [
      id,
    ]);

    // Return a success response with information about the deleted venue
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
  getAllVenues,
  createVenue,
  getVenue,
  updateVenue,
  deleteVenue,
};
