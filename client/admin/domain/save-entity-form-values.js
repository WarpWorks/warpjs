const warpGlobals = require('./../warp-globals');

module.exports = () => {
    if (warpGlobals.$active.entity) {
        warpGlobals.$active.entity.name = $("#entityNameI").val();
        warpGlobals.$active.entity.desc = $("#entityDescI").val();
        warpGlobals.$active.entity.entityType = $("#entityTypeI").val();
    }
};
