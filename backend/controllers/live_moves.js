const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/live_moves.json";

/**
 * Retrieves all live moves from a JSON file and sends them as a response.
 *
 * @function
 * @name getAllLiveMoves
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getAllLiveMoves = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Check if the data array is empty
    if (data.length === 0) {
      return res.status(200).json({
        message: "Data Not Found",
      });
    }
    // Log the retrieved data
    // console.log(data);

    // Return the data as a JSON response
    return res.status(200).json(data);
  });
};

/**
 * Retrieves a specific live move from a JSON file based on the provided step index
 * and sends it as a response.
 *
 * @function
 * @name getLiveMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getLiveMove = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    // Destructure the 'index' parameter from the request parameters
    const { index } = req.params;

    // Filter the data array to find the move with the specified step index
    const move = data.filter((item) => {
      return item.step == index;
    });

    // Check if the move was not found
    if (typeof move[0] === "undefined") {
      return res.status(200).json({
        message: "Data Not Found",
      });
    }
    // Log the retrieved data
    console.log(move[0]);
    // Return the data as a JSON response
    return res.status(200).json(move[0]);
  });
};

/**
 * Adds a new live move to the existing moves in a JSON file
 * and sends the new move as a response.
 *
 * @function
 * @name createLiveMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const createLiveMove = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'newMove' from the request body
    const { newMove } = req.body;

    // Add the new move to the existing data array
    data.push(newMove);

    // Write the updated data back to the file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Return the newly created move as a JSON response
    return res.status(201).json(newMove);
  });
};

/**
 * Updates a specific live move in a JSON file based on the provided step index
 * and sends the updated move as a response.
 *
 * @function
 * @name updateLiveMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateLiveMove = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'index' parameter from the request parameters
    const { index } = req.params;
    // Destructure the 'newMove' from the request body
    const { newMove } = req.body;
    // Update the specific move in the data array based on the step index
    data[index - 1] = newMove;

    // Write the updated data back to the file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });
    // Return the updated move as a JSON response
    return res.status(200).json(newMove);
  });
};

/**
 * Deletes a specific live move from a JSON file based on the provided step index
 * and sends the updated moves as a response.
 *
 * @function
 * @name deleteLiveMove
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const deleteLiveMove = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Destructure the 'index' parameter from the request parameters
    const { index } = req.params;
    // Remove the specific move from the data array based on the step index
    data.splice(index - 1, 1);

    // Write the updated data back to the file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });
    // Return the updated moves as a JSON response
    return res.status(200).json(data);
  });
};

/**
 * Deletes all live moves from a JSON file and sends an empty array as a response.
 *
 * @function
 * @name deleteAllLiveMoves
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const deleteAllLiveMoves = (req, res) => {
  // Write an empty array to the specified file, effectively deleting all moves
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
  getAllLiveMoves,
  getLiveMove,
  createLiveMove,
  updateLiveMove,
  deleteLiveMove,
  deleteAllLiveMoves,
};
