const updateActiveAssociation = require('./update-active-association');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    updateActiveAssociation(warpGlobals.$active.association.id);
};
