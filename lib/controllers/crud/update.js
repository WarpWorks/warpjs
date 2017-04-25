const debug = require('debug')('W2:WarpJS:crud:Update');
var ObjectID = require('mongodb').ObjectID;

const WarpJSError = require('./../../error');

function implementation(domain, db, collection, currentCommand, done) {
    // TBD - hack: This must process all values in "entities", not only the first element!
    // Notice - this requires being able to handle *different target types*!!!
    if (!currentCommand.entities || currentCommand.entities.length !== 1) {
        throw new WarpJSError("Update: 'entities' must contain exactly one entity, at the moment!");
    }
    var entity = currentCommand.entities[0];
    if (!entity._id) {
        throw new WarpJSError("Update target is missing '_id' field!");
    }

    debug("ID1:" + entity._id);
    var idQuery = {_id: new ObjectID(entity._id)};
    delete entity._id;
    debug("Collection: " + collection.collectionName);

    collection.update(idQuery, {$set: entity}, function(err, r) {
        if (err) {
            debug("Error updating object of type " + entity.targetType + ": " + err);
        } else {
            debug("Updated " + entity.targetType + " with ID " + idQuery._id.toString() + ": " + r);
        }
        done([]);
    });
}

implementation.TYPE = 'Update';

module.exports = implementation;
