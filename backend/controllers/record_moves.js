const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const fileDirectory = "./records/moves/";

/**
 * Retrieves recorded moves for a specific game ID from a JSON file
 * and sends them as a JSON response.
 *
 * @function
 * @name getRecordMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getRecordMove = (req, res) => {
  // Extract the game ID from the request parameters
  const { id } = req.params;

  // Construct the file path based on the game ID
  const filepath = fileDirectory + `record_${id}.json`;

  // Read the JSON file and send the data as a JSON response
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      // Send a server error response if reading the file encounters an issue
      return res.status(500).json([]);
    }

    // Log the retrieved data and send it as a success response
    console.log(data);
    return res.status(200).json(data);
  });
};

/**
 * Creates or overwrites recorded moves for a specific game ID in a JSON file
 * and sends the recorded moves as a JSON response.
 *
 * @function
 * @name createRecordMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const createRecordMove = (req, res) => {
  // Extract the game ID from the request parameters
  const { id } = req.params;

  // Construct the file path based on the game ID
  const filepath = fileDirectory + `record_${id}.json`;

  // Check if the file already exists
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create it with the provided recorded moves
      const data = req.body;
      fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
        // Handle write errors
        if (err) {
          console.log(err);
          // Send a server error response if writing to the file encounters an issue
          return res.status(500).json({
            message: "Failed to save record",
          });
        }
      });

      // Return the recorded moves as a success response
      return res.status(201).json(data);
    }

    // File already exists, send an error response
    return res.status(500).json({
      message: "Record already exist",
    });
  });
};

/**
 * Updates recorded moves for a specific game ID in a JSON file
 * and sends the updated recorded moves as a JSON response.
 *
 * @function
 * @name updateRecordMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateRecordMove = (req, res) => {
  // Extract the game ID from the request parameters
  const { id } = req.params;

  // Construct the file path based on the game ID
  const filepath = fileDirectory + `record_${id}.json`;

  // Read existing recorded moves from the file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Record does not exist",
      });
    }

    // Extract updated recorded moves from the request body
    const newData = req.body;

    // Write the updated recorded moves to the file
    fs.writeFile(filepath, JSON.stringify(newData, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Send the updated recorded moves as a success response
    return res.status(200).json(newData);
  });
};

/**
 * Deletes recorded moves for a specific game ID from a JSON file
 * and sends a response indicating the deletion status.
 *
 * @function
 * @name deleteRecordMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const deleteRecordMove = (req, res) => {
  // Extract the game ID from the request parameters
  const { id } = req.params;

  // Construct the file path based on the game ID
  const filepath = fileDirectory + `record_${id}.json`;

  // Check if the file exists
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      // Log and send an error response if the record does not exist
      console.log(err);
      return res.status(500).json({
        message: "Record does not exist",
      });
    }

    // Delete the file
    fs.unlink(filepath, (err) => {
      if (err) {
        // Log and send a server error response if deleting the file encounters an issue
        console.log(err);
        return res.status(500).json({
          message: "Failed to delete record",
        });
      }

      // Send a success response with the deleted record ID
      return res.status(200).json({
        deletedId: id,
      });
    });
  });
};

module.exports = {
  getRecordMove,
  createRecordMove,
  updateRecordMove,
  deleteRecordMove,
};
