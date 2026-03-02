// Already in server.js - exported for modularity if needed
module.exports = require('express-rate-limit')({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Rate limited' }
});
