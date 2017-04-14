const debug = require('debug')('W2:WarpJS:crud:AggregationQuery');
var ObjectID = require('mongodb').ObjectID;

const WarpJSError = require('./../../error');

function implementation(domain, db, collection, currentCommand, done) {
    if (!currentCommand.parentID || currentCommand.parentID === null) {
        throw new WarpJSError("AggregationQuery must include 'parentID'!");
    }

    const currentPage = currentCommand.currentPage || 0;
    const entitiesPerPage = currentCommand.entitiesPerPage || 10;
    const startingAt = entitiesPerPage * currentPage;

    debug("parentID: " + currentCommand.parentID);
    collection.find({
        parentID: ObjectID(currentCommand.parentID),
        parentRelnName: currentCommand.parentRelnName})
        .skip(startingAt)
        .limit(entitiesPerPage)
        .toArray(function(err2, arr) {
            const msg = "Found " + arr.length + " matching entities!";
            done([{
                queryType: "AggregationQuery",
                queryID: currentCommand.queryID,
                parentID: currentCommand.parentID,
                parentType: currentCommand.parentType,
                parentRelnName: currentCommand.parentRelnName,
                queryResult: arr,
                error: false,
                status: msg
            }]);
        });
}

implementation.TYPE = 'AggregationQuery';

module.exports = implementation;
