const saveAllFormValues = require('./save-all-form-values');
const updateActiveDomain = require('./update-active-domain');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    saveAllFormValues();

    // Update Domain form with new Entity, then update Entity form
    updateActiveDomain(warpGlobals.$active.entity.id);

    // Selected "name" text from newly created entity
    $("#entityDescI").focus().select();
};
