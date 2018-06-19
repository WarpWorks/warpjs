const sendHal = require('./send-hal');

module.exports = (req, res, resource, err, status) => {
    const execution = new Error();
    // eslint-disable-next-line no-console
    console.error("Execution stack:", execution.stack);
    // eslint-disable-next-line no-console
    console.error("Original error:", err);
    resource.error = true;
    resource.message = err.message;
    sendHal(req, res, resource, status || 500);
};
