const createModal = require('./../create-modal');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    createModal("Warnings for Domain '" + warpGlobals.$active.domain.name + "'", warpGlobals.$active.warnings, "warning", null);
};
