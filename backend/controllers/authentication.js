const pool = require("../database/pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const salt = 10;

/**
 * Verifies the user's authentication token stored in a cookie.
 *
 * @async
 * @function
 * @name verifyUser
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const verifyUser = async (req, res) => {
  // Retrieve the authentication token from the cookie
  const token = req.cookies.token;

  // Check if the token is not present
  if (!token) {
    return res.json({
      success: 0,
      message: "You are not Authorized",
    });
  } else {
    // Verify the token using the JWT_SECRET_KEY
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        // Token verification failed
        return res.json({
          success: 0,
          message: "Token invalid",
        });
      } else {
        // Token is valid, extract user name from decoded data
        req.name = decoded.name;

        // Respond with success and the user's name
        return res.status(200).json({
          success: 1,
          name: req.name,
        });
      }
    });
  }
};

/**
 * Registers a new administrator by hashing the provided password and storing the name and hashed password in the database.
 *
 * @async
 * @function
 * @name register
 * @param {any} req
 * @param {any} res
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
  // Hash the provided password using bcrypt
  bcrypt.hash(req.body.password.toString(), salt, async (err, hash) => {
    if (err) {
      // Handle bcrypt hashing error
      return res.json({
        success: 0,
        message: "Error on password hashing",
      });
    }
    // Prepare the values to be inserted into the database
    const value = [req.body.name, hash];

    try {
      // Check if an administrator with the provided name already exists
      const [preRows, preFields] = await pool.query(
        `SELECT * FROM admin WHERE name = ?`,
        [req.body.name]
      );

      if (preRows.length !== 0) {
        // Name already exists, return a response indicating the conflict
        return res.status(200).json({
          success: 0,
          message: "Name already exist.",
        });
      }

      // Insert the new administrator into the 'admin' table
      const [rows, fields] = await pool.query(
        `INSERT INTO admin (name, password) VALUES (?, ?)`,
        value
      );

      // Return a success response
      return res.status(201).json({
        success: 1,
      });
    } catch (error) {
      // Log any errors that occurred during the process
      console.log(error);

      // Return a JSON response indicating a server error
      return res.status(500).json({
        success: 0,
        message: "Failed to insert data in server",
      });
    }
  });
};

/**
 * Logs in an administrator by verifying the provided credentials and issuing an authentication token.
 *
 * @async
 * @function
 * @name login
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const login = async (req, res) => {
  try {
    // Query the database for an administrator with the provided name
    const [rows, fields] = await pool.query(
      `SELECT * FROM admin WHERE name = ?`,
      [req.body.name]
    );

    if (rows.length > 0) {
      // Compare the provided password with the stored password using bcrypt
      bcrypt.compare(
        req.body.password.toString(),
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
            // Password is correct, generate and set an authentication token
            const name = rows[0].name;
            const token = jwt.sign({ name }, process.env.JWT_SECRET_KEY, {
              expiresIn: "1d",
            });
            res.cookie("token", token);

            // Return a success response
            return res.status(200).json({
              success: 1,
            });
          } else {
            // Incorrect password provided
            return res.status(200).json({
              success: 0,
              reason: "password",
              message: "Password was incorrect",
            });
          }
        }
      );
    } else {
      // No administrator found with the provided name
      return res.status(200).json({
        success: 0,
        reason: "name",
        message: "No name existed",
      });
    }
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "Login Error in server",
    });
  }
};

/**
 * Logs out an administrator by clearing the authentication token stored in the cookie.
 *
 * @async
 * @function
 * @name logout
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const logout = async (req, res) => {
  // Clear the authentication token stored in the cookie
  res.clearCookie("token");

  // Return a success response
  return res.status(200).json({
    success: 1,
  });
};

module.exports = {
  verifyUser,
  register,
  login,
  logout,
};
