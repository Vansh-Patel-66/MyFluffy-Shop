import request from "supertest";
import app from "../src/app.js";

describe("Application Routes with Supertest", () => {
  it("should return a 404 for an unknown route", async () => {
    // Send a GET request to a route that doesn't exist
    const response = await request(app).get("/api/this-route-does-not-exist");
    
    // Express should return 404 Not Found
    expect(response.status).toBe(404);
  });

  it("should test rate limiter headers", async () => {
    // Send a request to any route
    const response = await request(app).get("/api-docs");

    // Supertest allows checking headers as well
    expect(response.headers['x-ratelimit-limit']).toBeDefined();
  });
});
