const { calculateTimestamp } = require("./util");
const queryManager = require("../lib/queryManager");
const { getMySQLConnection } = require("../lib/db");

const processMeterReadings = () => {
  let bufferedReadings = [];
  let record200 = null;

  return async (record) => {
    const type = record[0]; // record type

    if (type === "200") {
      if (record200) {
        await insertMeterReadings(bufferedReadings);
        bufferedReadings = []; // reset the buffer for the next batch
        record200 = record;
      } else {
        record200 = record;
      }
    } else if (type === "300" && record200) {
      // Process 300 records of the current 200 data block
      const nmi = record200[1]; // second value in the 200 record
      const intervalLength = record200[8]; // ninth value in the 200 record
      const intervalDate = record[1];
      const endIndex = 1440 / intervalLength;
      const consumptionData = record.slice(2, endIndex + 2); // get all the consumption values
      consumptionData.forEach((consumption, index) => {
        const timestamp = calculateTimestamp(
          intervalDate,
          index,
          intervalLength
        );

        // Save the reading data of the current 200 record into the readingsBuffer
        bufferedReadings.push({ nmi, timestamp, consumption });
      });
    }
  };
};

const insertMeterReadings = async (bufferedReadings) => {
  let connection;
  try {
    connection = await getMySQLConnection(); // get the database connection
    const queryPromises = bufferedReadings.map((reading) => {
      return new Promise((resolve, reject) => {
        console.log(
          reading.nmi + " " + reading.timestamp + " " + reading.consumption
        );
        //insert the meter readings to the db
        // connection.query(
        //   queryManager.INSERT_METER_READINGS,
        //   [reading.nmi, reading.timestamp, reading.consumption],
        //   (error) => {
        //     if (error) {
        //       console.error("Error inserting data:", error);
        //       reject(error); // reject the promise on error
        //     } else {
        //       console.log("Data inserted successfully:");
        //       resolve(); // resolve the promise
        //     }
        //   }
        // );
      });
    });
    await Promise.all(queryPromises); // Wait for all queries to finish
  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    if (connection) {
      console.log("Closing connection!!!");
      connection.end(); // Ensure connection is closed properly
    }
  }
};

module.exports = { processMeterReadings, insertMeterReadings };
