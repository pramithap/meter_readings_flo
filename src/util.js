const fs = require("fs");
const csv = require("fast-csv");

/**
 * Utility function to processes a CSV file line by line with a given data processing function.
 * @param {string} filePath Path to the CSV file.
 * @param {Function} processDataFn Function to process each row of data.
 * @returns {Promise<void>} A promise that resolves when processing is completed.
 */
const processCsvFile = async (filePath, processDataFn) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse({ delimiter: ",", headers: false }))
      .on("data", processDataFn)
      .on("end", resolve)
      .on("error", reject);
  });
};

/**
 * Utility function to calculate the timestamp from the interval date and index
 * @param {string} date - The start date of the interval series in 'YYYYMMDD' format.
 * @param {number} index - Index of the specific interval within the day.
 * @param {number} intervalLength - The length of each interval in minutes.
 * @returns {Date} A JavaScript Date object representing the start time of the specified interval.
 */
const calculateTimestamp = (date, index, intervalLength) => {
  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10) - 1;
  const day = parseInt(date.substring(6, 8), 10);
  const hours = Math.floor((index * intervalLength) / 60);
  const minutes = (index * intervalLength) % 60;
  return new Date(year, month, day, hours, minutes);
};

module.exports = { processCsvFile, calculateTimestamp };
