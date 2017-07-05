const warpGlobals = require('./../warp-globals');

module.exports = () => {
    if (warpGlobals.$active.association) {
        warpGlobals.$active.association.name = $("#associationNameI").val();
        warpGlobals.$active.association.desc = $("#associationDescI").val();
        warpGlobals.$active.association.targetMin = $("#associationTargetMinI").val();
        warpGlobals.$active.association.targetMax = $("#associationTargetMaxI").val();
        warpGlobals.$active.association.targetAverage = $("#associationTargetAvgI").val();

        warpGlobals.$active.association.updateDesc();

        // warpGlobals.$active.associationTarget is saved directly in selectTargetEntity()
    }
};
