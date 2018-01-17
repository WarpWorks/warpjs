const sendHal = require('./send-hal');

module.exports = (req, res, resource, err, status) => {
    resource.message = err.message;
    sendHal(req, res, resource, status || 500);
};
