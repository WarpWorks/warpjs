const sendHal = require('./send-hal');

module.exports = (req, res, resource, err, status) => {
    const execution = new Error();
    console.error("Execution stack:", execution.stack);
    console.error("Original error:", err);
    resource.error = true;
    resource.message = err.message;
    sendHal(req, res, resource, status || 500);
};
