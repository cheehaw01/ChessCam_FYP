const pool = require("../database/pool");
const bcrypt = require("bcrypt");
const salt = 10;

/**
 * This function is responsible for retrieving number of admin data from the
 * database and returning it as a JSON response.
 *
 * @async
 * @function
 * @name getAdminCount
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAdminCount = async (req, res) => {
  try {
    // Get number of row from the 'admin' table
    const [rows, fields] = await pool.query(
      `SELECT COUNT(*) AS count FROM admin`
    );

    // Log retrieved data for debugging purposes
    console.log(rows[0]["count"]);

    // Return a JSON response with the retrieved number of administrators
    return res.status(200).json({
      success: 1,
      data: rows[0]["count"],
    });
  } catch (error) {
    // Log any errors that occurred during the database query
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * This function is responsible for retrieving all admin data from the
 * database and returning it as a JSON response.
 *
 * @async
 * @function
 * @name getAllAdmins
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAllAdmins = async (req, res) => {
  try {
    // Fetch all administrators from the 'admin' table
    const [rows, fields] = await pool.query(`SELECT * FROM admin`);

    // Log retrieved data for debugging purposes
    console.log(rows);

    // Return a JSON response with the retrieved administrators
    return res.status(200).json({
      success: 1,
      data: rows,
    });
  } catch (error) {
    // Log any errors that occurred during the database query
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * This function is responsible for retrieving the admin data with a specific ID
 * from the database and returning it as a JSON response.
 *
 * @async
 * @function
 * @name getAdmin
 * @kind variable
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const getAdmin = async (req, res) => {
  try {
    // Destructure 'id' parameter from request
    const { id } = req.params;

    // Fetch the administrator with the specified ID from the 'admin' table
    const [rows, fields] = await pool.query(
      `SELECT * FROM admin WHERE id = ?`,
      [id]
    );

    // Check if no data found for provide ID
    if (rows.length === 0) {
      return res.status(200).json({
        success: 1,
        message: "Data not found",
      });
    }

    // Return a JSON response with the retrieved administrator's details
    return res.status(200).json({
      success: 1,
      data: rows[0],
    });
  } catch (error) {
    // Log any errors that occurred during the database query
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

/**
 * This function is responsible for updating the admin data in the database
 * based on the provided `id` parameter.
 * - It first checks if the provided `name` and `old_password` match the admin data in
 * the database.
 * - If they match, it hashes the `new_password` using bcrypt and updates the admin data in the database with
 * the new name and hashed password.
 * - Finally, it returns a response indicating the success or failure of the update
 * operation.
 *
 * @async
 * @function
 * @name updateAdmin
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const updateAdmin = async (req, res) => {
  try {
    // Destructure parameters from request
    const { name, old_password, new_password } = req.body;
    const { id } = req.params;

    // Check if an administrator with the provided name exists
    const [rows, fields] = await pool.query(
      `SELECT * FROM admin WHERE name = ?`,
      [name]
    );

    // Compare the provided old password with the stored password using bcrypt
    if (rows.length > 0) {
      bcrypt.compare(
        old_password.toString(),
        rows[0].password,
        (err, isMatch) => {
          if (err) {
            // Handle bcrypt comparison error
            return res.status(500).json({
              success: 0,
              message: "Password compare error.",
            });
          }
          if (isMatch) {
            // Hash the new password using bcrypt
            bcrypt.hash(new_password.toString(), salt, async (err, hash) => {
              if (err) {
                // Handle bcrypt hashing error
                return res.json({
                  success: 0,
                  message: "Error on password hashing",
                });
              }

              // Update the administrator's details in the database
              const [result] = await pool.query(
                `UPDATE admin SET name = ?, password = ? WHERE id = ?`,
                [name, hash, id]
              );

              if (result.affectedRows === 1) {
                // Successful update
                return res.status(200).json({
                  success: 1,
                });
              }

              // No changes made
              return res.status(200).json({
                success: 0,
                message: "No Changed",
              });
            });
          } else {
            // Incorrect old password provided
            return res.status(200).json({
              success: 0,
              message: "Password was incorrect",
            });
          }
        }
      );
    }
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
 * This function is responsible for deleting the admin data with a specific
 * ID from the database.
 * - It first checks if the provided `password` matches the admin data in the database.
 * - If it matches, it deletes the admin data from the database and
 * returns a response indicating the success or failure of the delete operation.
 *
 * @async
 * @function
 * @name deleteAdmin
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const deleteAdmin = async (req, res) => {
  try {
    // Destructure parameters from request
    const { password } = req.body;
    const { id } = req.params;

    // Check if an administrator with the provided name exists
    const [rows, fields] = await pool.query(
      `SELECT * FROM admin WHERE id = ?`,
      [id]
    );

    if (rows.length > 0) {
      // Compare the provided old password with the stored password using bcrypt
      bcrypt.compare(
        password.toString(),
        rows[0].password,
        async (err, isMatch) => {
          if (err) {
            // Handle bcrypt comparison error
            return res.status(500).json({
              success: 0,
              message: "Password compare error.",
            });
          }
          if (isMatch) {
            // Delete the administrator from the database
            const [result] = await pool.query(
              `DELETE FROM admin WHERE id = ?`,
              [id]
            );

            return res.status(200).json({
              success: 1,
              deletedId: id,
              affectedRow: result.affectedRows,
            });
          } else {
            // Incorrect password provided
            return res.status(200).json({
              success: 0,
              message: "Password was incorrect",
            });
          }
        }
      );
    } else {
      // No administrator found with the provided ID
      return res.status(200).json({
        success: 0,
        message: "No Record",
      });
    }
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
  getAdminCount,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
