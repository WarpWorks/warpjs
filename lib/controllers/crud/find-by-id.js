const debug = require('debug')('W2:WarpJS:crud:FindByID');
var ObjectID = require('mongodb').ObjectID;

const WarpJSError = require('./../../error');

function findOneCB(done, domain, db, collection, id, currentCommand, error, results) {
    if (results) {
        let msg = `Found instance for ID=${results._id} in Domain ${domain}`;
        const result = results;
        const breadcrumb = [];
        const resultList = [];

        // Recursive Closure:
        // eslint-disable-next-line no-inner-declarations
        function createBreadcrumb(mongoError, mongoResult) {
            let err;

            if (mongoError) {
                err = true;
                msg = mongoError;
            } else if (mongoResult) {
                breadcrumb.unshift({
                    _id: mongoResult._id,
                    type: mongoResult.type,
                    shortHand: mongoResult.Name || mongoResult.type
                });
            }
            if (mongoError || !mongoResult || mongoResult.isRootInstance) {
                resultList.push({
                    queryType: implementation.TYPE,
                    queryID: currentCommand.queryID,
                    matchingEntity: result,
                    breadcrumb,
                    error: err,
                    status: msg
                });
                debug(`breadcrumb(): msg=${msg}`);
                done(resultList);
            } else {
                const parentName = mongoResult.parentBaseClassName;
                const parentCollection = db.collection(parentName);
                parentCollection.findOne({
                    _id: ObjectID(mongoResult.parentID)
                }, createBreadcrumb);
            }
        }

        createBreadcrumb(error, results);
    } else {
        const status = error || `No matching object for ID=${id}`;
        done([{
            error: true,
            status
        }]);
    }
}

function implementation(domain, db, collection, currentCommand, done) {
    const id = currentCommand.targetID;
    if (!id) {
        throw new WarpJSError(`FindByID-Query must contain 'targetID'!`);
    }

    collection.findOne({_id: ObjectID(id)}, findOneCB.bind(null, done, domain, db, collection, id, currentCommand));
}

implementation.TYPE = 'FindByID';

module.exports = implementation;
