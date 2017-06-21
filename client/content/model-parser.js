class WarpModelParser {
    constructor(jsonData) {
        this.model = jsonData;
    }

    getRelationshipDetails(relationshipID) {
        var relnID = parseInt(relationshipID);
        var result = {};
        result.relnJson = this.getRelationshipByID(relnID);
        result.targetJson = this.getEntityByID(result.relnJson.targetEntity[0]);
        result.parentJson = this.getRelnParentByID(relnID);
        result.parentBaseClassJson = this.getBaseClass(result.parentJson);
        return result;
    }

    getBaseClassByID(entityID) {
        return this.getBaseClass(this.getEntityByID(entityID));
    }

    getBaseClass(entity) {
    // BaseClass = Topmost, non-abstract class in the inheritance hierarchy
        if (entity.parentClass && entity.parentClass.length > 0) {
            var parent = this.getEntityByID(entity.parentClass[0]);
            if (!parent.isAbstract) {
                return this.getBaseClass(parent);
            }
        }
        if (entity.isAbstract) {
            return null;
        }
        return entity;
    }

    getEntityByName(entityName) {
        return this.model.entities.find(function(entity) {
            return entity.name === entityName;
        });
    }

    getEntityByID(entityID) {
        return this.model.entities.find(function(entity) {
            return entity.id === entityID;
        });
    }

    getDerivedEntitiesByID(entityID, includeAbstractEntities, includeChildrensChildren) {
        var results = [];
        this.model.entities.forEach(function(entity) {
            if (entity.parentClass.length > 0) {
                if (entity.parentClass[0] === entityID) {
                    if (includeAbstractEntities || !entity.isAbstract) {
                        results.push(this.getEntityByID(entity.id));
                    }
                }
            }
        }.bind(this));
        if (includeChildrensChildren) {
            results.forEach(function(derivedEntity) {
                var childChildren = this.getDerivedEntitiesByID(derivedEntity.id);
                if (childChildren.length > 0) {
                    results.push(childChildren);
                }
            }.bind(this));
        }
        return results;
    }

    getPropertyByID(propertyID) {
        for (var idx = 0; idx < this.model.entities.length; idx++) {
            var property = this.model.entities[idx].basicProperties.find(function(elem) {
                return elem.id === propertyID;
            });
            if (property) {
                return property;
            }
        }
        return null;
    }

    getRelnParentByID(relnID) {
        for (var idx = 0; idx < this.model.entities.length; idx++) {
            var reln = this.model.entities[idx].relationships.find(function(elem) {
                return elem.id === relnID;
            });
            if (reln) {
                return this.model.entities[idx];
            }
        }
        return null;
    }

    getEnumByID(enumID) {
        for (var idx = 0; idx < this.model.entities.length; idx++) {
            var e = this.model.entities[idx].enums.find(function(elem) {
                return elem.id === enumID;
            });
            if (e) {
                return e;
            }
        }
        return null;
    }

    getRelationshipByID(relnID) {
        for (var idx = 0; idx < this.model.entities.length; idx++) {
            var reln = this.model.entities[idx].relationships.find(function(elem) {
                return elem.id === relnID;
            });
            if (reln) {
                return reln;
            }
        }
        return null;
    }

    getPageView(entity, viewName) {
        return entity.pageViews.find(function(view) {
            return view.name === viewName;
        });
    }

    getDefaultPageView(entity) {
        return entity.pageViews.find(function(view) {
            return view.isDefault;
        });
    }

    getDefaultTableView(entity) {
        return entity.tableViews.find(function(view) {
            return view.isDefault;
        });
    }
}

module.exports = WarpModelParser;
