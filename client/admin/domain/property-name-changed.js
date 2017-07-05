const saveAllFormValues = require('./save-all-form-values');
const updateActiveProperty = require('./update-active-property');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    saveAllFormValues();
    updateActiveProperty(warpGlobals.$active.basicProperty.id);
};
