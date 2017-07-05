const saveAllFormValues = require('./save-all-form-values');
const updateActiveEnum = require('./update-active-enum');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    saveAllFormValues();
    updateActiveEnum(warpGlobals.$active.enumeration.id);
};
