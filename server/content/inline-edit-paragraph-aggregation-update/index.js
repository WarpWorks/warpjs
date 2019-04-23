const updateAggregation = require('./update-aggregation');

module.exports = Object.freeze({
    post: async (req, res) => updateAggregation(req, res)
});
