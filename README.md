This project is my solution for the Coding Challenge:
### Build Your Own Load Balancer
https://codingchallenges.fyi/challenges/challenge-load-balancer

# Backend Server (backend.js):

- The backend server (backend.js) serves an index.ejs file using EJS templating.
- It responds to /health endpoint with a status code 200 indicating it's healthy.
- index.ejs file renders the HTML with dynamic data (PORT, IP, USER_AGENT).

# Load Balancer (loadbalancer.js):

- The load balancer implements round-robin load balancing among multiple backend servers (localhost:3001, localhost:3002, localhost:3003).
- Health checks are performed on each backend server every 10 seconds (healthCheckInterval).
- If a server fails the health check (returns status other than 200), it is marked as unhealthy (isHealthy = false).
- Automatically checks the health of the servers if one of them returns with an error.

# Tests:
- Check if servers are being assigned using round robin algorithm
- Check if load balancer handles concurrent requests
  
# Setting Up Load Balancer Environment
This guide will help you set up an environment to run a load balancer using Node.js.
## Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (and npm): You can download it from nodejs.org.
- Git: You can download it from git-scm.com.

## Installation
### 1. Clone the Repository

    - git clone https://github.com/alexisNorthcoders/load-balancer.git
    - cd load-balancer

### 2. Install Dependencies
    - npm install

### 3. Start Backend Servers
This will start 3 instances of the backend.js on port 3001 3002 and 3003.

    - npm run start-servers

### 4. Starting the Load Balancer
To start the load balancer, use the following command:

    - npm run start

### 5. Running Tests
To run the tests (the servers need to be running):

    - npm test

### 6. Manually checking the load balancer working
To easily see the load balancer working, open your local browser on:

    - http://localhost