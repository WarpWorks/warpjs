const generatePdf = require('./generate-pdf');

module.exports = Object.freeze({
    get: async (req, res) => generatePdf(req, res)
});
