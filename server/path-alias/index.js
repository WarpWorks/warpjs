const app = require('./app');

module.exports = Object.freeze({
    app: (baseUrl, staticUrlPath) => app(baseUrl, staticUrlPath)
});
