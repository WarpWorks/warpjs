const app = require('./app');
const middlewares = require('./middlewares');
const packageJson = require('./../../package.json');

module.exports = {
    app,
    middlewares,
    version: packageJson.version
};
