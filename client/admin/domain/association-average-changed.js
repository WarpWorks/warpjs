const warpGlobals = require('./../warp-globals');

module.exports = () => {
    var avg = $("#associationTargetAvgI").val();
    avg = parseInt(avg);
    warpGlobals.$active.association.targetAverage = avg;
    console.log("Avg " + avg);
    warpGlobals.$active.association.updateDesc();
    $("#associationDescI").val(warpGlobals.$active.association.desc);
};
