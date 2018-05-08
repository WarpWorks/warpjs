const Domain = require('./../models/domain');
const warpCore = require('./../index');

module.exports = (jsonData) => {
    // Re-create model hierarchy:
    return Domain.fromFileJSON(jsonData, warpCore);
};
