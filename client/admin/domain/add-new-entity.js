const saveAllFormValues = require('./save-all-form-values');
const updateActiveDomain = require('./update-active-domain');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Save current values
    saveAllFormValues();

    // Create new Entity
    var newEntity = warpGlobals.$active.domain.addNew_Entity("New_Entity", "");
    newEntity.isRootInstance = false;
    newEntity.isRootEntity = false;

    // Update Domain form with new Entity, then update Entity form
    updateActiveDomain(newEntity.id);

    // Selected "name" text from newly created entity
    $("#entityNameI").focus().select();
};
