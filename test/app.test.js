const { isFileExists } = require("../app");

describe("isFileExists", () => {
  it("should resolve without error if the file exists", async () => {
    await expect(isFileExists("./data/sample.csv")).resolves.toBeUndefined();
  });
});
