const restCalls = require('./../rest-calls');
const saveAllFormValues = require('./save-all-form-values');

module.exports = () => {
    // Save last changes from form => warpGlobals.$active.domain
    saveAllFormValues();

    // Post to server
    restCalls.postDomainData();
};
