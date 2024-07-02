const request = require("supertest");
const { describe, it, beforeAll, afterAll } = require("@jest/globals");
const { server, cleanUp, resetLoadBalancerState } = require("../loadbalancer");

beforeEach(() => {
  resetLoadBalancerState();
});
describe("Load Balancer Tests", () => {
  it("Should return 200 OK from backend server", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
  });
  it("Should distribute requests in round-robin fashion", async () => {
    const numRequests = 6;
    const expectedServers = ["localhost:3001", "localhost:3002", "localhost:3003", "localhost:3001", "localhost:3002", "localhost:3003"];

    const responses = [];

    for (let i = 0; i < numRequests; i++) {
      const response = await request(server).get("/");
      responses.push(response);
    }
    const serversUsed = responses.map((response) => response.headers["x-backend-server"]);

    expect(serversUsed).toEqual(expectedServers);
  });
  it("Should handle concurrent requests", async () => {
    const numRequests = 10;
    const requests = [];

    for (let i = 0; i < numRequests; i++) {
      requests.push(request(server).get("/"));
    }

    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });
  });

  afterAll(() => {
    cleanUp();
  });
});
