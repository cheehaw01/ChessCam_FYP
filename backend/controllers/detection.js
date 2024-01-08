const pool = require("../database/pool");
const fs = require("fs");
const { spawn } = require("child_process");

const filepath = "./temp/live_status.json";
const detectionProgramTopFilePath = "./python/simulate_fen_san_with_input.py";
const detectionProgramSideFilePath = "./python/main.py";


/**
 * Calls a Python script for game detection and stores relevant information in a file.
 * Waits for the Python script to exit and returns a success response.
 *
 * @async
 * @function
 * @name callDetectionPyScript
 * @param {any} req
 * @param {any} res
 * @returns {Promise<void>}
 */
const callDetectionPyScript = async (req, res) => {
  // Destructure the 'game_id' from the request body
  const { game_id, camera_angle, camera_ip } = req.body;

  // Select detection program
  let detectionProgramFilePath = detectionProgramTopFilePath;
  if (camera_angle === "Side") {
    detectionProgramFilePath = detectionProgramSideFilePath;
  }

  // Spawn a Python script for game detection
  const pythonDetection = spawn("python", [detectionProgramFilePath]);

  // Log the process ID of the spawned Python script
  console.log(pythonDetection.pid);

  // Prepare data to be stored in a file
  const data = {
    onLive: true,
    pythonProcessPid: pythonDetection.pid,
    game_id: game_id,
    camera_ip: camera_ip,
  };

  // Write data to a file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      // Handle file writing error
      console.log(err);

      // File writing unsuccessful, return an error response
      return res.status(500).json({
        message: "Error Writing File",
      });
    }
  });

  // For debug purpose
  pythonDetection.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  // Listen for the exit event of the Python script
  pythonDetection.on("exit", (code) => {
    console.log(`Simulation Script exit with code ${code}`);

    // Return a success response after script completion
    return res.status(200).json({
      message: "Simulation Run Complete",
    });
  });
};

/**
 * Kills a running Python script for game detection using the provided process ID.
 *
 * @async
 * @function
 * @name killDetectionPyScript
 * @param {any} req
 * @param {any} res
 * @returns {Promise<any>}
 */
const killDetectionPyScript = async (req, res) => {
  // Destructure the 'pythonProcessPid' from the request body
  const { pythonProcessPid } = req.body;

  try {
    // Use 'taskkill' to forcefully terminate the Python script
    spawn("taskkill", ["/pid", pythonProcessPid, "/f", "/t"]);

    // Log the terminated process ID
    console.log("kill pid: ", pythonProcessPid);

    // Return a success response after killing the script
    return res.status(200).json({
      message: "Detection Kill Complete",
    });
  } catch (err) {
    // Handle the case where no detection script is running
    return res.status(200).json({
      message: "No Detection Running",
    });
  }
};

module.exports = {
  callDetectionPyScript,
  killDetectionPyScript,
};
