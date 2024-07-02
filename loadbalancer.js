const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const morgan = require("morgan");

const servers = [
  { hostname: "localhost", port: 3001, isHealthy: true },
  { hostname: "localhost", port: 3002, isHealthy: true },
  { hostname: "localhost", port: 3003, isHealthy: true },
];
let currentServerIndex = 0;
const healthCheckInterval = 10 * 1000;
checkAllServersHealth()
const intervalId = setInterval(checkAllServersHealth, healthCheckInterval);

app.use(morgan("dev"));
app.use((req, res) => {
   
  const healthyServers = servers.filter((server) => server.isHealthy);
  if (healthyServers.length === 0) {
    res.status(503).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Backend Server</title>
</head>
<body>
    <h1>Services are down! Try again later!</h1>
    
</body>
</html>`);
    return;
  }
  const currentServer = getNextServer(healthyServers);
  proxyRequest(req, res, currentServer);
});

function healthCheck(server) {
  const options = {
    hostname: server.hostname,
    port: server.port,
    path: `/health`,
    method: "GET",
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      server.isHealthy = true;
    } else {
      console.log(`Health check failed for server  ${server.hostname}:${server.port}. Status code: ${res.statusCode}`);
      server.isHealthy = false;
    }
  });

  req.on("error", (error) => {
    console.error(`Error during health check for server  ${server.hostname}:${server.port}:`, error.message);
    server.isHealthy = false;
  });

  req.end();
}
function resetLoadBalancerState() {
  currentServerIndex = 0;
}
function checkAllServersHealth() {
  servers.forEach(healthCheck);
}
function getNextServer(healthyServers) {
  const server = healthyServers[currentServerIndex];
  currentServerIndex = (currentServerIndex + 1) % healthyServers.length;
  return server;
}
function proxyRequest(req, res, server) {
  const options = {
    hostname: server.hostname,
    port: server.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      "x-backend-server": `${server.hostname}:${server.port}`,
    });
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Error:", err);
    checkAllServersHealth()
    res.status(502).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Backend Server</title>
</head>
<body>
    <h1>Service down! Please try again!</h1>
    
</body>
</html>`);
  });

  req.pipe(proxyReq);
}

module.exports = { server, cleanUp: () => clearInterval(intervalId), resetLoadBalancerState };
