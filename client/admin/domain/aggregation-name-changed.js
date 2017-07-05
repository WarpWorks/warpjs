const updateActiveAggregation = require('./update-active-aggregation');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    updateActiveAggregation(warpGlobals.$active.aggregation.id);
};
