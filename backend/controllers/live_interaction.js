const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/live_interaction.json";

/**
 * Retrieves the live interaction information from a JSON file
 * and sends it as a response.
 *
 * @function
 * @name getLiveInteraction
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getLiveInteraction = (req, res) => {
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
    return res.status(200).json(data);
  });
};

/**
 * Creates / Resets the live status information in a JSON file
 * based on the provided data and sends it as a response.
 *
 * @function
 * @name createLiveInteraction
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const createLiveInteraction = (req, res) => {
  // Create an object with the live interaction data
  const data = {
    promotion: false,
    illegalMove: false,
    promotionNewPiece: "",
    illegalCorrectMove: "",
    wrongDetection: false,
    cameraStart: false,
  };

  // Write the live interaction data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
  });

  // Return the created or updated live interaction as a JSON response
  return res.status(201).json(data);
};

/**
 * Updates the live interaction data in a JSON file and sends it as a response.
 *
 * @function
 * @name updateLiveInteraction
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateLiveInteraction = (req, res) => {
  // Extract live interaction data from the request body
  const { pawnPromotion, moveCorrection, wrongDetection } = req.body;

  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    // Update the live interaction data
    if (pawnPromotion !== "") {
      data.promotionNewPiece = pawnPromotion;
      data.promotion = false;
    }
    if (moveCorrection !== "") {
      data.illegalCorrectMove = moveCorrection;
      data.illegalMove = false;
    }
    if (wrongDetection === true) {
      data.wrongDetection = wrongDetection;
    }
    console.log(data);

    // Write the updated live interaction data to the specified file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Return a success response with the updated data
    return res.status(201).json(data);
  });
};

module.exports = {
  getLiveInteraction,
  createLiveInteraction,
  updateLiveInteraction,
};
