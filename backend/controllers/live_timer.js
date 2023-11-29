const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/live_timer.json";

/**
 * Retrieves the timer status information from a JSON file and sends it as a response.
 *
 * @function
 * @name getTimerStatus
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getTimerStatus = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Log the retrieved data
    console.log(data);

    // Return the timer status information as a JSON response
    return res.status(200).json({
      white: data.white,
      black: data.black,
      turn: data.turn,
    });
  });
};

/**
 * Creates or updates the timer status information in a JSON file
 * based on the provided data and sends a success response.
 *
 * @function
 * @name createTimerStatus
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const createTimerStatus = (req, res) => {
  // Destructure timer status data from the request body
  const { white, black, turn } = req.body;

  // Create an object with the timer status data
  const data = {
    white: white,
    black: black,
    turn: turn,
  };

  // Write the timer status data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
  });

  // Return a success response indicating the timer status update
  return res.status(201).json({
    success: 1,
    message: "Timer Status Updated",
  });
};

/**
 * Updates the timer status information in a JSON file based on the provided turn
 * and time data and sends a success response.
 *
 * @function
 * @name updateTimerStatus
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateTimerStatus = (req, res) => {
  // Extract turn and time data from the request parameters and body
  const { turn } = req.params;
  const { time } = req.body;

  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    // Update timer data based on the provided turn and time
    // 1 - black timer start
    // 2 - white timer start
    if (turn === "1" && time !== undefined) {
      data.black = time;
    } else if (turn === "2" && time !== undefined) {
      data.white = time;
    }

    // Update the turn value to an integer
    data.turn = parseInt(turn);

    // Write the updated timer status data to the specified file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Return a success response with the updated turn and time
    return res.status(201).json({
      turn: data.turn,
      time: time,
    });
  });
};

/**
 * Resets the timer status information in a JSON file to default values
 * and sends a success response.
 *
 * @function
 * @name deleteTimerStatus
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const deleteTimerStatus = (req, res) => {
  // Define default timer status values
  const data = {
    white: ["20", "00"],
    black: ["20", "00"],
    turn: 0,
  };

  // Write the default timer status data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json();
    }
  });

  // Log and return a success response with the default timer status data
  console.log("live_status set default");
  return res.status(200).json(data);
};

module.exports = {
  getTimerStatus,
  createTimerStatus,
  updateTimerStatus,
  deleteTimerStatus,
};
