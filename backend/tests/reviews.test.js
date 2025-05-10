
const request = require("supertest");
const app = require("../server"); 

describe("GET /reviews", () => {
  it("should respond with 200", async () => {
    const res = await request(app).get("/reviews");
    expect(res.statusCode).toBe(200);
  });
});

