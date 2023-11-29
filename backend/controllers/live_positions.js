const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/live_positions.json";

/**
 * Retrieves all live positions from a JSON file and sends them as a response.
 *
 * @function
 * @name getAllLivePositions
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getAllLivePositions = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Log the retrieved data
    console.log(data);
    // Return the data as a JSON response
    return res.status(200).json(data);
  });
};

/**
 * Retrieves a specific live position from a JSON file based on the provided index
 * and sends it as a response.
 *
 * @function
 * @name getLivePosition
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getLivePosition = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'index' parameter from the request parameters
    const { index } = req.params;

    // Log the retrieved data of the specified index
    console.log(data[index]);

    // Return the data as a JSON response
    return res.status(200).json(data[index]);
  });
};

/**
 * Adds a new live position to the existing moves in a JSON file
 * and sends the new position as a response.
 *
 * @function
 * @name createLivePosition
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const createLivePosition = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'newPosition' from the request body
    const { newPosition } = req.body;

    // Add the new position to the existing data array
    data.push(newPosition);

    // Write the updated data back to the file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Return the newly created move as a JSON response
    return res.status(201).json(newPosition);
  });
};

/**
 * Updates a specific live position in a JSON file based on the provided index
 * and sends the updated position as a response.
 *
 * @function
 * @name updateLivePosition
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateLivePosition = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'index' parameter from the request parameters
    const { index } = req.params;
    // Destructure the 'newPosition' from the request body
    const { newPosition } = req.body;
    // Update the specific position in the data array based on the index
    data[index] = newPosition;

    // Write the updated data back to the file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });
    // Return the updated move as a JSON response
    return res.status(200).json(newPosition);
  });
};

/**
 * Deletes a specific live position from a JSON file based on the provided index
 * and sends the updated positions as a response.
 *
 * @function
 * @name deleteLivePosition
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const deleteLivePosition = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'index' parameter from the request parameters
    const { index } = req.params;
    // Remove the specific position from the data array based on the index
    data.splice(index, 1);

    // Write the updated data back to the file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });
    // Return the updated positions as a JSON response
    return res.status(200).json(data);
  });
};

/**
 * Deletes all live positions from a JSON file and sends an empty array as a response.
 *
 * @function
 * @name deleteAllLivePositions
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const deleteAllLivePositions = (req, res) => {
  // Write an empty array to the specified file, effectively deleting all positions
  fs.writeFile(filepath, "[]", (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
  });
  // Return an empty array as a JSON response
  return res.status(200).json([]);
};

module.exports = {
  getAllLivePositions,
  getLivePosition,
  createLivePosition,
  updateLivePosition,
  deleteLivePosition,
  deleteAllLivePositions,
};
