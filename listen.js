const {server} = require('./loadbalancer');
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});