const updateActiveEnum = require('./update-active-enum');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    warpGlobals.$active.entity.remove_Enumeration(warpGlobals.$active.enumeration.id);
    warpGlobals.$active.enumeration = null;
    updateActiveEnum();
};
