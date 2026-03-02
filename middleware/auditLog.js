const logger = require('../lib/logger');

module.exports = (req, res, next) => {
  const audit = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    bodySize: req.body ? Object.keys(req.body).length : 0
  };
  logger.audit(JSON.stringify(audit));
  next();
};
