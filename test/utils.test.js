const { calculateTimestamp } = require("../src/util");

describe("calculateTimestamp", () => {
  it("calculates a timestamp when a date, index, and interval length are given", () => {
    const date = "20050301";
    const index = 2;
    const intervalLength = 30;
    let expectedDate = new Date(2005, 2, 1, 1, 0); // Expected: March 1, 2005, 01:00
    let result = calculateTimestamp(date, index, intervalLength);
    expect(result).toEqual(expectedDate);

    const nextIndex = 48;
    expectedDate = new Date(2005, 2, 2, 0, 0); // Expected: March 2, 2005, 00:00
    result = calculateTimestamp(date, nextIndex, intervalLength);
    expect(result).toEqual(expectedDate);
  });
});
