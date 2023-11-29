const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/live_status.json";

/**
 * Retrieves the live status information from a JSON file
 * and sends it as a response.
 *
 * @function
 * @name getLiveStatus
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getLiveStatus = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Log the retrieved data
    console.log(data);

    // Return the live status information as a JSON response
    return res.status(200).json({
      onLive: data.onLive,
      game_id: data.game_id,
    });
  });
};

/**
 * Retrieves the Python process ID (PID) from a JSON file and sends it as a response.
 *
 * @function
 * @name getPyPid
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getPyPid = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Log the retrieved data
    console.log(data);

    // Return the Python process ID (PID) as a JSON response
    return res.status(200).json({ pythonProcessPid: data.pythonProcessPid });
  });
};

/**
 * Creates or updates the live status information in a JSON file
 * based on the provided data and sends it as a response.
 *
 * @function
 * @name createLiveStatus
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const createLiveStatus = (req, res) => {
  // Destructure live status data from the request body
  const { onLive, pythonProcessPid, game_id, deadline } = req.body;

  // Create an object with the live status data
  const data = {
    onLive: onLive,
    pythonProcessPid: pythonProcessPid,
    game_id: game_id,
  };

  // Write the live status data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
  });

  // Return the created or updated live status as a JSON response
  return res.status(201).json({ onLive: onLive });
};

/**
 * Deletes the live status information in a JSON file, setting default values,
 * and sends it as a response.
 *
 * @function
 * @name deleteLiveStatus
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const deleteLiveStatus = (req, res) => {
  // Create an object with default live status data
  const data = {
    onLive: false,
    pythonProcessPid: null,
    game_id: null,
  };

  // Write the default live status data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json();
    }
  });

  // Log a message and return the default live status as a JSON response
  console.log("live_status set default");
  return res.status(200).json({ onLive: data.onLive });
};

module.exports = {
  getLiveStatus,
  getPyPid,
  createLiveStatus,
  deleteLiveStatus,
};
