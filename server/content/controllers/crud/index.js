const debug = require('debug')('W2:WarpJS:crud:index');
var ObjectID = require('mongodb').ObjectID;

var $rt = require('./../../W2Runtime.js');
const WarpJSError = require('@warp-works/warpjs-utils');

const aggregationQuery = require('./aggregation-query');
const findAssocTargetOptions = require('./find-association-target-options');
const FetchListOfContentChildrenEntities = require('./fetch-list-of-content-children-entities');
const findById = require('./find-by-id');
const getRootInstance = require('./get-root-instance');
const update = require('./update');

function register(implementations, implementation) {
    implementations[implementation.TYPE] = implementation;
    return implementations;
}

const IMPLEMENTATIONS = [
    aggregationQuery,
    findAssocTargetOptions,
    FetchListOfContentChildrenEntities,
    findById,
    getRootInstance,
    update
].reduce(register, {});

function crud(req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        try {
            var commandList = req.body.commandList;

            // TBD - Hack: Currently only use Command Lists of length 1
            if (!commandList || commandList.length !== 1) {
                throw new WarpJSError("Invalid Command List");
            }
            var currentCommand = commandList[0];

            var domain = currentCommand.domain;
            if (!domain) {
                throw new WarpJSError("Error processing CRUD command - no domain specified!");
            }

            // Always use the base type (i.e. the topmost non-abstract class in the inheritance hierarchy):
            var targetType = $rt.getBaseClassName(domain, currentCommand.targetType).name;
            if (!targetType) {
                throw new WarpJSError("Error processing CRUD command - no target type specified!");
            }

            $rt.useDB(domain, function(db) {
                var collection = db.collection(targetType);
                debug("/appApi/CRUD: Command=" + currentCommand.command + ", DB=" + db.databaseName + ", Collection=" + collection.collectionName);

                const implementation = IMPLEMENTATIONS[currentCommand.command];
                if (implementation) {
                    debug(`Found implementation for '${currentCommand.command}'.`);
                    implementation(domain, db, collection, currentCommand, function(results) {
                        debug(`implementation.done(): results=`, results);
                        results.forEach((result) => {
                            result.queryType = currentCommand.command;
                            result.queryID = currentCommand.queryID;
                        });
                        res.send({
                            resultList: results,
                            success: true
                        });
                    });
                } else {
                    debug(`*** Need implementation for '${currentCommand.command}'.`);
                    switch (currentCommand.command) {
                        case "Create":
                            var value = currentCommand.entity; // TBD: HACK, should work with list
                            if (value._id) {
                                throw new WarpJSError("Failed to create new entity - new entity data must not contain '_id' field before creation!");
                            }
                            if (!value.parentID) {
                                throw new WarpJSError("Failed to create new entity - parentEntityProxy ID is missing!");
                            }
                            value.parentID = ObjectID(value.parentID);
                            collection.insertOne(value, function(err, r) {
                                if (err) {
                                    debug("Error creating new object of base type " + value.type + ": " + err);
                                } else {
                                    debug("Created entity with base type " + value.type + ", ID=" + value._id + ": " + r);
                                }
                                res.send({
                                    newEntity: {
                                        _id: value._id,
                                        type: currentCommand.targetType
                                    },
                                    success: true
                                });
                            });
                            return;
                        default:
                            throw new WarpJSError("Unknown command: " + currentCommand.command);
                    }
                }
            });
        } catch (err) {
            debug("Error processing CRUD command: " + err);
            debug(err.stack);
            res.send({
                success: false,
                error: err.toString()
            });
        }
    } else {
        res.redirect(303, '/error');
    }
}

module.exports = crud;
