const ComplexTypes = require('./../complex-types');
const createInstanceFromJSON = require('./create-instance-from-json');
const warpCore = require('./../index');
const WarpWorksError = require('./../error');

module.exports = (jsonData) => {
    // Re-create model hierarchy:
    const domain = createInstanceFromJSON(jsonData, ComplexTypes.Domain, warpCore);

    // In the JSON format, in-memory references have been replaced with OIDs.
    // Now we must replace any of these OIDs with in-memory object references again
    domain.replaceOIDs();

    return domain;
};
