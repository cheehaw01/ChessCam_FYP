const fs = require("fs");
const jsonReader = require("../file-system/json_reader");

const filepath = "./temp/camera.json";
const imagefilepath = "./image/";

/**
 * Read string and create image file
 *
 * @function
 * @name createImage
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const createImage = (req, res) => {
  try {
    const { image } = req.body;
    const imageName = `chessboard.jpg`;
    const imagePath = `${imagefilepath}${imageName}`;
    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    fs.writeFile(imagePath, imageBuffer, (err) => {
      if (err) {
        console.error("Error saving image:", err);
        res.status(500).send("Error saving image");
      }
      console.log("Image saved:", imageName);
    });

    // Return a JSON response with the retrieved number of administrators
    return res.status(200).json({
      success: 1,
    });
  } catch (error) {
    // Log any errors that occurred during the database query
    console.log(error);

    // Return a JSON response indicating a server error
    return res.status(500).json({
      success: 0,
      message: "Error capturing image.",
    });
  }
};

/**
 * Retrieves the capture image information from a JSON file and sends it as a response.
 *
 * @function
 * @name getCaptureImgInstruction
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const getCaptureImgInstruction = (req, res) => {
  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    // Log the retrieved data
    console.log(data);

    // Return the capture image status information as a JSON response
    return res.status(200).json(data);
  });
};

/**
 * Creates or updates the capture image instruction information in a JSON file
 * based on the provided request instruction data and sends a success response.
 *
 * @function
 * @name createCaptureImgInstruction
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const createCaptureImgInstruction = (req, res) => {
  // Create an object with the CaptureImg instruction data
  const data = {
    captureImg: false,
  };

  // Write the capture image instruction data to the specified file
  fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
    // Handle write errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
  });

  // Return a success response indicating the CaptureImg instruction data created
  return res.status(201).json({
    success: 1,
    message: "CaptureImg Instruction Created",
  });
};

/**
 * Updates the capture image instruction data in a JSON file and sends a success response.
 *
 * @function
 * @name updateCaptureImgInstruction
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateCaptureImgInstruction = (req, res) => {
  // Extract trigger data from the request parameter
  const { capture } = req.params;

  // Call the jsonReader function to read data from the specified file
  jsonReader(filepath, (err, data) => {
    // Handle read errors
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    // Update the captureImg
    data.captureImg = parseInt(capture) === 1 ? true : false;

    // Write the updated capture image instruction data to the specified file
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      // Handle write errors
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }
    });

    // Return a success response with the updated turn and time
    return res.status(201).json({
      captureImg: data.captureImg,
    });
  });
};

module.exports = {
  createImage,
  getCaptureImgInstruction,
  createCaptureImgInstruction,
  updateCaptureImgInstruction,
};
