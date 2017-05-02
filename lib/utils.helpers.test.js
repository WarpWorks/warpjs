const testHelpers = require('@quoin/node-test-helpers');

const app = require('./app')('/foo');

function requestApp() {
    return testHelpers.request(app);
}

module.exports = {
    requestApp
};
