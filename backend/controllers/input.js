const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/input.json";

/**
 * Retrieves the input information from a JSON file and sends it as a response.
 *
 * @function
 * @name getInputInstruction
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getInputInstruction = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Log the retrieved data
    console.log(data);

    // Return the input status information as a JSON response
    return res.status(200).json(data);
  });
};

/**
 * Creates or updates the input instruction information in a JSON file
 * based on the provided request instruction data and sends a success response.
 *
 * @function
 * @name createInputInstruction
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const createInputInstruction = (req, res) => {
  // Create an object with the input instruction data
  const data = {
    timerButton: false,
  };

  // Write the input instruction data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
  });

  // Return a success response indicating the input instruction data created
  return res.status(201).json({
    success: 1,
    message: "Input Instruction Created",
  });
};

/**
 * Updates the input instruction data in a JSON file and sends a success response.
 *
 * @function
 * @name updateInputInstruction
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateInputInstruction = (req, res) => {
  // Extract trigger data from the request parameter
  const { trigger } = req.params;

  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    // Update the timerButton
    data.timerButton = parseInt(trigger) === 1 ? true : false;

    // Write the updated input instruction data to the specified file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Return a success response with the updated turn and time
    return res.status(201).json({
      timerButtonPressed: data.timerButton,
    });
  });
};

/**
 * Resets the input instruction data in a JSON file to default values
 * and sends a success response.
 *
 * @function
 * @name resetInputInstruction
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const resetInputInstruction = (req, res) => {
  // Define default timer status values
  const data = {
    timerButton: false,
  };

  // Write the default timer status data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json();
    }
  });

  // Return a success response with the default timer status data
  return res.status(200).json(data);
};

module.exports = {
  getInputInstruction,
  createInputInstruction,
  updateInputInstruction,
  resetInputInstruction,
};
