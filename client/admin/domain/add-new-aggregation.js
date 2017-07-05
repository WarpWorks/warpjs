const updateActiveAggregation = require('./update-active-aggregation');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Create new Aggregation
    var newAggregation = warpGlobals.$active.entity.addNew_Relationship("New_Aggregation", "");
    newAggregation.isAggregation = true;

    // Now update the active aggregation
    updateActiveAggregation(newAggregation.id);

    // Selected "name" text from newly created aggregation
    $("#aggregationNameI").focus().select();
};
