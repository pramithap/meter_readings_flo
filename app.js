const path = require("path");
const fs = require("fs");
const fsp = fs.promises;
require("dotenv").config();
const { processMeterReadings } = require("./src/processData");
const { processCsvFile } = require("./src/util");

/**
 * Asynchronously checks if a file exists at the specified file path.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<void>} - ruturn A promise upon resolveing it if the file exists, or rejects
if there is no file.
 */
const isFileExists = async (filePath) => {
  try {
    await fsp.access(filePath, fs.constants.F_OK); //asynchronously checks if the file at the 'filePath' exists
  } catch (err) {
    throw new Error(`"${filePath}" does not exist!.`);
  }
};

/**
 * The main execution function
 * @returns {Promise<void>} - A promise which resolves when the file processing is completed.
 */
const main = async () => {
  // get the file path from the command line
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Please provide the path to the file.");
    process.exit(1);
  }

  // resolves file path to an absolute one which can be relative or not complete
  const fullFilePath = path.resolve(filePath);

  try {
    await isFileExists(fullFilePath);
    console.log(`File ${fullFilePath} is processing: `);
    const processMeterReadingsData = processMeterReadings();
    await processCsvFile(fullFilePath, processMeterReadingsData);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log("File processing is completed.");
  }
};

/*** Execute main function */
if (require.main === module) {
  main();
}

module.exports = { isFileExists };
