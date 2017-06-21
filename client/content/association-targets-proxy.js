const RelationshipProxy = require('./relationship-proxy');
const utils = require('./../utils');

class AssociationTargetsProxy extends RelationshipProxy {
    // constructor(jsonReln, parentEntityProxy) {
    //     super(jsonReln, parentEntityProxy);
    // }

    setTargetType(newType) {
    // TBD
    // - Ensure that newType is either the original type or a derived type
    // - Have to remember the original type for this...

        this.targetType = newType;
        this.requiresUpdate = true;
    }

    useRelationship(callback) {
        if (!this.requiresUpdate) {
            utils.trace(2, "AssociationTargetsProxy.useRelationship", "Re-using data for " + this.jsonReln.name);
            callback(this);
            return;
        } else {
            utils.trace(2, "AssociationTargetsProxy.useRelationship", "Loading Relationship data for " + this.jsonReln.name);
        }

        if (this.targetIsDocument) {
            var command = {
                queryID: 1,
                domain: $warp.domain,
                command: "FindAssocTargetOptions",
                sourceID: this.id,
                sourceType: this.parentType,
                targetType: this.targetType,
                sourceRelnName: this.name,
                sourceRelnID: this.id,
                currentPage: this.currentPage,
                entitiesPerPage: this.entitiesPerPage,
                filter: this.filter
            };
            var parentEntity = this.getParentEntity();
            parentEntity.useData(function(parentEntity) {
                if (parentEntity) {
                    command.parentID = parentEntity.getValue('_id');
                    var reqData = {commandList: []};
                    reqData.commandList.push(command);
                    $warp.processCRUDcommands(reqData, function(result) {
                        if (result.success) {
                            var entityDocs = result.resultList[0].queryResult;
                            this._queryResultsCount = result.resultList[0].noOfTotalQueryResults;
                            this._queryResults = [];
                            entityDocs.forEach(function(entityDoc) {
                                var entityConfig = {
                                    type: entityDoc.type,
                                    isDocument: this.targetIsDocument,
                                    mode: "editEntity",
                                    oid: entityDoc._id,
                                    data: entityDoc,
                                    parentRelnProxy: this
                                };
                                var proxy = $warp.entityCacheFindOrAddNewEntityProxy(entityConfig);
                                this._queryResults.push(proxy);
                            }.bind(this));
                            this.requiresUpdate = false;
                            this.ensureSelectedEntityIdxIsValid();
                            utils.trace(1, "AssociationTargetsProxy.useRelationship", "Document: AssociationQuery for " + result.resultList[0].sourceRelnName + " (found:" + this.noOfTotalQueryResults() + ")");
                            callback(this);
                        } else {
                            utils.trace(1, "AssociationTargetsProxy.useRelationship():\n-  Warning - could not execute AssociationQuery");
                        }
                    }.bind(this));
                } else {
                    utils.trace(1, "AssociationTargetsProxy.useRelationship():\n-  Warning - can not use relationship - parentEntity not found!");
                }
            }.bind(this));
        } else {
        // Embedded entity
            throw new Error("Embedded entities as association targets currently not supported!");
        }
    }
}

module.exports = AssociationTargetsProxy;
