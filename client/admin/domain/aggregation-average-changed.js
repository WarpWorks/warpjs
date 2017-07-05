const warpGlobals = require('./../warp-globals');

module.exports = () => {
    var avg = $("#aggregationTargetAvgI").val();
    avg = parseInt(avg);
    warpGlobals.$active.aggregation.targetAverage = avg;
    console.log("Avg " + avg);
    warpGlobals.$active.aggregation.updateDesc();
    $("#aggregationDescI").val(warpGlobals.$active.aggregation.desc);
};
