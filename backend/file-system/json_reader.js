const fs = require("fs");

/**
 * Reads and parses JSON data from a specified file path.
 *
 * @function
 * @name jsonReader
 * @param {any} filepath
 * @param {any} callBack
 * @returns {void}
 */
function jsonReader(filepath, callBack) {
  // Read the contents of the specified JSON file asynchronously
  fs.readFile(filepath, "utf8", (err, fileData) => {
    // Handle read errors
    if (err) {
      return callBack && callBack(err);
    }

    try {
      // Parse the JSON data into an object
      const object = JSON.parse(fileData);

      // Invoke the callback with the parsed object (no error)
      return callBack && callBack(null, object);
    } catch (err) {
      // Handle parsing errors
      return callBack && callBack(err);
    }
  });
}

module.exports = jsonReader;
