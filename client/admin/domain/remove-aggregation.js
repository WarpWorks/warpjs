const updateActiveAggregation = require('./update-active-aggregation');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    warpGlobals.$active.entity.remove_Relationship(warpGlobals.$active.aggregation.id);
    warpGlobals.$active.aggregation = null;
    updateActiveAggregation();
};
