const createModal = require('./../create-modal');
const saveAllFormValues = require('./save-all-form-values');
const updateActiveEntity = require('./update-active-entity');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    saveAllFormValues();
    var newReln = warpGlobals.$active.domain.getRootInstance().addNew_Relationship("my" + warpGlobals.$active.entity.name + "s", "");
    newReln.isAggregation = true;
    newReln.setTargetEntity(warpGlobals.$active.entity);
    warpGlobals.$active.entity.isRootEntity = true;
    updateActiveEntity(warpGlobals.$active.entity.id);
    console.log("Entity '" + warpGlobals.$active.entity.name + "' is now a root entity (new relationship '" + newReln.name + "' was automatically added)");
    createModal("New Status", "Entity '" + warpGlobals.$active.entity.name + "' is now a root entity (new relationship '" + newReln.name + "' was automatically added)");
};
