const updateActiveAssociation = require('./update-active-association');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    warpGlobals.$active.entity.remove_Relationship(warpGlobals.$active.association.id);
    warpGlobals.$active.association = null;
    updateActiveAssociation();
};
