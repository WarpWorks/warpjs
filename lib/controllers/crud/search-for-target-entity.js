const debug = require('debug')('W2:WarpJS:crud:SearchForTargetEntity');

const $rt = require('./../../W2Runtime.js');
const WarpJSError = require('./../../error');

function implementation(domain, db, collection, currentCommand, done) {
    const currentPage = currentCommand.currentPage || 0;
    const entitiesPerPage = currentCommand.entitiesPerPage || 10;
    const startingAt = entitiesPerPage * currentPage;

    // Always use the base type (i.e. the topmost non-abstract class in the inheritance hierarchy):
    const targetType = $rt.getBaseClassName(domain, currentCommand.targetType).name;
    if (!targetType) {
        throw new WarpJSError("Error processing CRUD command - no target type specified!");
    }

    // Find all elements in collection representing this type
    const query = {};
    const filters = currentCommand.filter ? currentCommand.filter.replace(/\s/g, '').split("&") : null;
    const resultList = [];
    if (filters) {
        for (let f in filters) {
            let filter = filters[f].split("=");
            if (filter.length === 2) {
                if (filter[0] === "Type") {
                    collection = db.collection(filter[1]);
                } else {
                    query[filter[0]] = RegExp(filter[1], "i");
                }
            }
        }

        const cursor = collection.find(query);
        cursor.count(function(mongoErr1, count) {
            cursor.skip(startingAt);
            cursor.limit(entitiesPerPage);
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
    } else {
        resultList.push({
            queryType: currentCommand.command,
            targetType: currentCommand.targetType,
            queryResult: [],
            noOfTotalQueryResults: 0,
            error: false,
            status: ""
        });
        done(resultList);
    }
}

implementation.TYPE = 'SearchForTargetEntity';

module.exports = implementation;
