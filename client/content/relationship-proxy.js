const utils = require('./../utils');

// TBD - replace with a proper solution
function generateID() {
    var date = new Date().getTime();
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var rand = (Math.random() * 16 + date) % 16 | 0;
        date = Math.floor(date / 16);
        return (c === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
    });
    return id;
}

class RelationshipProxy {
    constructor(jsonReln, parentEntityProxy) {
        this.parentEntityProxy = parentEntityProxy;
        this.jsonReln = jsonReln;

        // TBD - clean this up and use "WarpJSModelParser.getRelationshipDetails()" instead
        this.name = jsonReln.name;
        this.id = jsonReln.id;
        this.isAggregation = jsonReln.isAggregation;
        this.targetEntityDefinition = $warp.model.getEntityByID(jsonReln.targetEntity[0]);
        this.targetType = this.targetEntityDefinition.name;
        this.targetIsDocument = this.targetEntityDefinition.entityType === "Document";
        this.parentType = $warp.model.getRelnParentByID(jsonReln.id).name;

        this.requiresUpdate = true;
        this.currentPage = 0;
        this.entitiesPerPage = 5;
        this.maxNumberOfPages = 5;
        this.selectedEntityIdx = -1;
        this.filter = null;

        this._queryResults = [];
        this._queryResultsCount = -1;

        utils.trace(2, "RelationshipProxy():\n-  New proxy for " + this.jsonReln.name);
    }

    noOfResultsOnCurrentPage() {
        if (this.requiresUpdate) {
            throw new Error("noOfResultsOnCurrentPage() called on invalid RelationshipProxy!");
        }
        return this._queryResults.length;
    }

    noOfTotalQueryResults() {
        if (this.requiresUpdate) {
            throw new Error("noOfTotalQueryResults() called on invalid RelationshipProxy!");
        }
        return this._queryResultsCount;
    }

    queryResult(idx) {
        if (this.requiresUpdate) {
            throw new Error("queryResult() called on invalid RelationshipProxy!");
        }
        if (idx < 0 || idx >= this.noOfTotalQueryResults()) {
            throw new Error("queryResult() called with invalid index: " + idx);
        }
        return this._queryResults[idx];
    }

    allQueryResults() {
        if (this.requiresUpdate) {
            throw new Error("allQueryResults() called on invalid RelationshipProxy!");
        }
        return this._queryResults;
    }

    toString(spacing) {
        var spaces = "";
        var str = "";
        for (var idx = 0; idx < spacing; idx++) {
            spaces += " ";
        }
        if (this.requiresUpdate) {
            str = "\n" + spaces + " - RelnProxy [" + this.name + "/" + this.id + "]: INVALID!";
        } else {
            str = "\n" + spaces + " - RelnProxy [" + this.name + "/" + this.id + "]: len=" + this.noOfResultsOnCurrentPage() + ", idx=" + this.selectedEntityIdx;
        }
        return str;
    };

    updateConfig(cfg) {
        this.requiresUpdate = true;
        this.entitiesPerPage = cfg.entitiesPerPage;
        this.maxNumberOfPages = cfg.maxNumberOfPages;
    }

    setFilter(f) {
        this.requiresUpdate = true;
        this.filter = f;
        this.currentPage = 0;
    }

    getParentEntity() {
        return this.parentEntityProxy;
    }

    ensureSelectedEntityIdxIsValid() {
        if (this.selectedEntityIdx < 0 || this.selectedEntityIdx >= this.noOfResultsOnCurrentPage()) {
            this.selectedEntityIdx = 0;
        }
    }

    setSelectedEntity(idx) {
        if (idx === "last") {
            if (this.targetIsDocument) {
                throw new Error("Can not select last entity on documents!");
            }
            this.selectedEntityIdx = 0;
            this.currentPage = 0;
            this.decrementEntitySelection();
        } else {
            if (idx < 0 || idx > this.noOfResultsOnCurrentPage()) {
                throw new Error("RelationshipProxy.setSelectedEntity() - Selection out of bounds: " + idx);
            }
            this.selectedEntityIdx = idx;
        }
    }

    absolutePos() {
        return this.currentPage * this.entitiesPerPage + this.selectedEntityIdx;
    }

    incrementEntitySelection() {
        if (this.absolutePos() === this.noOfTotalQueryResults() - 1) {
        // We have reached the end, start at beginning
            this.selectedEntityIdx = 0;
            this.currentPage = 0;
            this.requiresUpdate = true;
        } else if (this.selectedEntityIdx < this.entitiesPerPage - 1) {
        // Next element on same page
            this.selectedEntityIdx++;
        } else if (this.selectedEntityIdx === this.entitiesPerPage - 1) {
        // End of this page, start with next page
            this.currentPage++;
            this.selectedEntityIdx = 0;
            if (this.currentPage > this.noOfTotalQueryResults() / this.entitiesPerPage) {
                this.currentPage = 0;
            }
            this.requiresUpdate = true;
        } else {
            throw new Error("RelationshipProxy.selectEntity(): Internal error - case not covered!");
        }
    }

    decrementEntitySelection() {
        if (this.absolutePos() === 0) {
        // We have reached the beginning, continue at the end
            if (this.noOfTotalQueryResults() < this.entitiesPerPage) {
                this.currentPage = 0;
                this.selectedEntityIdx = this.noOfTotalQueryResults() - 1;
            } else {
                this.currentPage = Math.floor(this.noOfTotalQueryResults() / this.entitiesPerPage) - 1;
                this.selectedEntityIdx = this.noOfTotalQueryResults() - this.currentPage * this.entitiesPerPage - 1;
                this.requiresUpdate = true;
            }
        } else if (this.selectedEntityIdx > 0) {
        // Previous element on same page
            this.selectedEntityIdx--;
        } else if (this.selectedEntityIdx === 0) {
        // Beginning of this page, continue on prev. page
            this.currentPage--;
            this.selectedEntityIdx = this.entitiesPerPage - 1;
            this.requiresUpdate = true;
        } else {
            throw new Error("RelationshipProxy.selectEntity(): Internal error - case not covered!");
        }
    }

    incrementSelectedPage(selection) {
        var totalPages = 1 + Math.floor(this.noOfTotalQueryResults() / this.entitiesPerPage);
        if (totalPages === 1) {
            return;
        }
        this.requiresUpdate = true;
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
        } else {
            this.currentPage = 0;
        }
    }

    decrementSelectedPage(selection) {
        var totalPages = Math.floor(this.noOfTotalQueryResults() / this.entitiesPerPage);
        if (totalPages === 1) {
            return;
        }
        this.requiresUpdate = true;
        if (this.currentPage === 0) {
            this.currentPage = totalPages - 1;
        } else {
            this.currentPage--;
        }
    }

    getProxyForSelectedEntity() {
        if (this.targetIsDocument) {
            return this.queryResult(this.selectedEntityIdx);
        } else {
        // Embedded documents always have the complete array as query result:
            return this.queryResult(this.absolutePos());
        }
    }

    addNewEmbeddedEntity(newEntity, callback) {
        this.getParentEntity().useData(function(ep) {
            if (this.targetIsDocument) {
                throw new Error("addNewEmbeddedEntity can not create 'Document'!");
            }

            if (!newEntity) {
                newEntity = {};
            } else {
                if (newEntity.type && newEntity.type !== this.targetType) {
                    throw new Error("addNewEmbeddedEntity: type mismatch - " + newEntity.type + " != " + this.targetType);
                }
            }
            newEntity.type = this.targetType;
            newEntity._id = generateID();

            var entityContainer = null;

            if (ep.data.embedded) {
                for (var idx = 0; idx < ep.data.embedded.length; idx++) {
                    if (ep.data.embedded[idx].parentRelnID === this.id) {
                        entityContainer = ep.data.embedded[idx];
                    }
                }
            }
            if (entityContainer === null) {
                entityContainer = {
                    parentRelnID: this.id,
                    parentRelnName: this.name,
                    entities: []
                };
                if (!ep.data.embedded) {
                    ep.data.embedded = [];
                }
                ep.data.embedded.push(entityContainer);
            }
            entityContainer.entities.push(newEntity);

            this.requiresUpdate = true;
            ep.getDocumentProxy().isDirty = true;
            ep.addToHistory(
                {
                    type: "addNewEmbeddedEntity",
                    reln: this.type
                });

            utils.trace(1, "EntityProxy.addNewEmbeddedEntity", "Adding new embedded entity!");

            callback(newEntity);
        }.bind(this));
    };
}

module.exports = RelationshipProxy;
