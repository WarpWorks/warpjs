const warpGlobals = require('./../warp-globals');

module.exports = () => {
    if (warpGlobals.$active.aggregation) {
        warpGlobals.$active.aggregation.name = $("#aggregationNameI").val();
        warpGlobals.$active.aggregation.desc = $("#aggregationDescI").val();
        warpGlobals.$active.aggregation.targetMin = $("#aggregationTargetMinI").val();
        warpGlobals.$active.aggregation.targetMax = $("#aggregationTargetMaxI").val();
        warpGlobals.$active.aggregation.targetAverage = $("#aggregationTargetAvgI").val();

        warpGlobals.$active.aggregation.updateDesc();

        // warpGlobals.$active.aggregationTarget is saved directly in selectTargetEntity()
    }
};
