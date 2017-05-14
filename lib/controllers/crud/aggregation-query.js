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

    var query = {
        parentID: ObjectID(currentCommand.parentID),
        parentRelnName: currentCommand.parentRelnName};
    var cursor = collection.find(query);
    const resultList = [];
    cursor.count(function(mongoErr1, count) {
        cursor.skip(startingAt);
        cursor.limit(entitiesPerPage);
        cursor.toArray(function (err2, arr) {
            const msg = arr ? "Found " + arr.length + " matching entities!" : "No matching entities";
            done([{
                queryType: "AggregationQuery",
                queryID: currentCommand.queryID,
                parentID: currentCommand.parentID,
                parentType: currentCommand.parentType,
                parentRelnName: currentCommand.parentRelnName,
                queryResult: arr,
                queryResultsCount: count,
                error: false,
                status: msg
            }]);
        });
    });
}

implementation.TYPE = 'AggregationQuery';

module.exports = implementation;
