const createDomainFromJSON = require('./create-domain-from-json');

module.exports = (jsonString) => {
    return createDomainFromJSON(JSON.parse(jsonString));
};
