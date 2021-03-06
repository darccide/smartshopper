const request = require("request");
const server = require("../../server.js");
const base = "http://localhost:5000/";

describe("routes : static", () => {
  describe("GET /", () => {
    it("should return status code 200", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});
