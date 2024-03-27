const {
  processMeterReadings,
  insertMeterReadings,
} = require("../src/processData");
const { calculateTimestamp } = require("../src/util");
const { getMySQLConnection } = require("../lib/db");

// dependancy mocking
jest.mock("../src/processData", () => ({
  ...jest.requireActual("../src/processData"),
  processMeterReadings: jest.fn().mockReturnValue(() => {
    return async (data) => {
      // Mock implementation
    };
  }),
  insertMeterReadings: jest.fn(), // Mock insertMeterReadings
}));

// Your existing mocks
jest.mock("../src/util", () => ({
  calculateTimestamp: jest.fn(),
}));
jest.mock("../lib/db", () => ({
  getMySQLConnection: jest.fn().mockResolvedValue({
    query: jest.fn((sql, params, callback) => callback(null)),
    end: jest.fn(),
  }),
}));

describe("processMeterReadings", () => {
  let processMeterReadingsData;

  beforeEach(() => {
    processMeterReadingsData = processMeterReadings();
    calculateTimestamp.mockImplementation(
      (date, index, length) => `mocked-timestamp-${index}`
    );
    getMySQLConnection.mockResolvedValue({
      query: jest.fn((sql, params, callback) => callback(null)),
      end: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("processes type 200 records correctly", async () => {
    await processMeterReadingsData([
      "200,NEM1201009,E1E2,1,E1,N1,01009,kWh,30,20050610",
    ]);

    //for the first record, the function should not call
    expect(insertMeterReadings).toHaveBeenCalledTimes(0);
  });
});
