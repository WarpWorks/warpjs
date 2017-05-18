const debug = require('debug')('W2:WarpJS:crud:FindAssocTargetOptions');

var $rt = require('./../../W2Runtime.js');
const WarpJSError = require('./../../error');

function implementation(domain, db, collection, currentCommand, done) {
    const currentPage = currentCommand.currentPage || 0;
    const entitiesPerPage = currentCommand.entitiesPerPage || 10;
    const startingAt = entitiesPerPage * currentPage;

    // Always use the base type (i.e. the topmost non-abstract class in the inheritance hierarchy):
    var targetType = $rt.getBaseClassName(domain, currentCommand.targetType).name;
    if (!targetType) {
        throw new WarpJSError("Error processing CRUD command - no target type specified!");
    }

    // Find all elements in collection representing this type
    var query = {};
    var filters = currentCommand.filter ? currentCommand.filter.replace(/\s/g, '').split("&") : null;
    if (filters) {
        for (var f in filters) {
            var filter = filters[f].split("=");
            if (filter.length === 2) {
                if (filter[0] === "Type") {
                    collection = db.collection(filter[1]);
                } else {
                    query[filter[0]] = RegExp(filter[1], "i");
                }
            }
        }
    }
    var cursor = collection.find(query);
    const resultList = [];
    cursor.count(function(mongoErr1, count) {
        cursor.skip(startingAt);
        cursor.limit(entitiesPerPage);
        cursor.toArray(function(mongoErr2, arr) {
            var msg = "";
            var err = false;
            if (arr && !mongoErr1 && !mongoErr2) {
                resultList.push({
                    queryType: "FindAssocTargetOptions",
                    queryID: currentCommand.queryID,
                    sourceID: currentCommand.sourceID,
                    sourceType: currentCommand.sourceType,
                    sourceRelnName: currentCommand.sourceRelnName,
                    sourceRelnID: currentCommand.sourceRelnID,
                    targetType: currentCommand.targetType,
                    queryResult: arr,
                    totalQueryResultsCount: count,
                    error: err,
                    status: msg
                });
                msg = "Found " + count + " instances for Type=" + targetType + " in Domain " + domain;
            } else {
                err = true;
                msg = mongoErr2 || "No matching object for Type=" + targetType + " in Domain " + domain;
            }
            debug(msg);
            done(resultList);
        });
    });
}

implementation.TYPE = 'FindAssocTargetOptions';

module.exports = implementation;
