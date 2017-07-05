const restCalls = require('./../rest-calls');
const updateActiveDomain = require('./update-active-domain');

module.exports = () => {
    restCalls.getDomainData(updateActiveDomain);
};
