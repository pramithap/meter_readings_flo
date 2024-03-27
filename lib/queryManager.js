var INSERT_METER_READINGS =
  "INSERT INTO MeterReadings (Id, nmi, timestamp, consumption) VALUES (UUID(), ?, ?, ?) ON DUPLICATE KEY UPDATE consumption = VALUES(consumption);";

module.exports = {
  INSERT_METER_READINGS: INSERT_METER_READINGS,
};
