const debug = require('debug')('W2:WarpJS:crud:FetchListOfContentChildrenEntities');

const $rt = require('./../../W2Runtime.js');
const WarpJSError = require('./../../error');

function implementation(domain, db, collection, currentCommand, done) {
    // // Always use the base type (i.e. the topmost non-abstract class in the inheritance hierarchy):
    const targetType = $rt.getBaseClassName(domain, currentCommand.targetType).name;
    if (!targetType) {
        throw new WarpJSError("Error processing CRUD command - no target type specified!");
    }

    const resultList = [];
    collection = db.collection(currentCommand.filter);

    const query = {};

    const cursor = collection.find(query);
    cursor.count(function(mongoErr1, count) {
        cursor.toArray(function(mongoErr2, arr) {
            let msg = "";
            let err = false;
            if (arr && !mongoErr1 && !mongoErr2) {
                resultList.push({
                    queryType: currentCommand.command,
                    targetType: currentCommand.targetType,
                    queryResult: arr,
                    noOfTotalQueryResults: count,
                    error: err,
                    status: msg
                });
                msg = `Found ${count} instances for Type=${targetType} in Domain ${domain}`;
            } else {
                err = true;
                msg = mongoErr2 || `No matching object for Type=${targetType} in Domain ${domain}`;
            }
            debug(msg);
            done(resultList);
        });
    });
}

implementation.TYPE = 'FetchListOfContentChildrenEntities';

module.exports = implementation;
