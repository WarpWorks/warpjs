const debug = require('debug')('W2:WarpJS:crud:Delete');
var ObjectID = require('mongodb').ObjectID;

const WarpJSError = require('./../../error');

function implementation(domain, db, collection, currentCommand, done) {
    // TBD - this also needs to delete all the child elements in the DB!!!
    const id = currentCommand.targetID;
    if (!id) {
        throw new WarpJSError("Find-Query must contain targetID!");
    }
    collection.deleteOne({_id: ObjectID(id)}, function(mongoErr, mongoRes) {
        var msg = "";
        var err = false;
        // var result = null;
        if (mongoRes) {
            msg = "Object deleted: " + id;
            // result = mongoRes;
        } else {
            err = true;
            msg = mongoErr || "No matching object for ID=" + id;
        }
        debug(msg);
        done([{
            queryType: "Delete",
            queryID: currentCommand.queryID,
            error: err,
            status: msg
        }]);
    });
}

implementation.TYPE = 'Delete';

module.exports = implementation;
