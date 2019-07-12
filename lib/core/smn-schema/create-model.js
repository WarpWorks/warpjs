const createNewDomain = require('./create-new-domain');
const utils = require("./../utils");
const WarpWorksError = require('./../error');

module.exports = (model, domain) => {
    var i;
    var r;
    var rel;

    var domainFromModel = null;
    for (i in model) {
        if (model[i].isDomain) {
            domainFromModel = i;
        }
    }
    if (domain && domainFromModel) {
        throw new WarpWorksError("Error: trying to add new domain #" + domainFromModel + " while also giving " + domain.name);
    }
    if (!domain && domainFromModel) {
        domain = createNewDomain(domainFromModel, domainFromModel + " from SMN");
    }
    if (!domain || domain == null) {
        throw new WarpWorksError("Error creating model from SMN - no domain specified!");
    }

    // Remember new entities with unresolved parentClass
    var newEntitiesWithParent = [];

    // Remember newly created relationships, so that we can resolve the targets later
    var newRelationships = [];

    // Remember domain definition, if included
    var domainElem = null;

    // Create new entities
    for (var m in model) {
        var elem = model[m];
        if (elem.isDomain) {
            if (domainElem) {
                throw new WarpWorksError("Only one domain should be declared per SMN file!");
            }
            domainElem = elem;
        } else {
            var entity = domain.addNewEntity(m, "");
            entity.isAbstract = elem.isAbstract;
            if (elem.baseClass) {
                entity.baseClass = elem.baseClass;
                newEntitiesWithParent.push(entity);
            }

            elem.properties.forEach((p) => {
                if (p.type.includes("[")) {
                    var a = utils.extractTagValue(p.type, "[", "]");
                    var en = entity.addNewEnum(p.property);
                    var literals = a[1].split("|");
                    literals.forEach((literal) => {
                        en.addNewLiteral(literal);
                    });
                } else {
                    entity.addNewBasicProperty(p.property, "", p.type);
                }
            });

            elem.aggregations.forEach((agg) => {
                r = entity.addNewRelationship(null, true, agg.sourceRole);
                if (agg.targetType.includes("*")) {
                    r.targetMax = "*";
                } else if (agg.targetType.includes("+")) {
                    r.targetMax = "+";
                }
                newRelationships.push([ agg.targetType, r ]);
            });

            elem.associations.forEach((association) => {
                r = entity.addNewRelationship(null, false, association.sourceRole);
                newRelationships.push([ association.targetType, r ]);
            });
        }
    }

    // Mark rootEntity instances
    if (domainElem) {
        if (domainElem.aggregations.length === 0) {
            throw new WarpWorksError("Domain definition does not define child elements. Include '#MyDomain: {MyEntity*}' to do so!");
        }
        for (rel in domainElem.aggregations) {
            var targetType = domainElem.aggregations[rel].targetType;
            if (targetType.includes('*')) {
                targetType = targetType.replace("*", "");
            } else {
                // console.log("Warning: Assuming cardinality '*' for rootEntity instance " + targetType);
                if (targetType.includes('+')) {
                    targetType = targetType.replace("+", "");
                }
            }
            var target = domain.findElementByName(targetType, "Entity");
            if (!target) {
                throw new WarpWorksError("Error creating new relationship: No matching entity '" + targetType + "'!");
            }
            target.setRootEntityStatus(true);
        }
    }

    // Resolve targets for parent classes
    for (i in newEntitiesWithParent) {
        entity = newEntitiesWithParent[i];
        target = domain.findElementByName(entity.baseClass, "Entity");
        if (!target) {
            throw new WarpWorksError("No matching parent entity '" + entity.baseClass + "' found for entity'" + entity.name + "'!");
        }
        entity.setParentClass(target);
    }

    // Finally, resolve missing targets in relations
    for (i in newRelationships) {
        var targetName = newRelationships[i][0];
        if (targetName.includes('*')) {
            targetName = targetName.split("*")[0];
        }
        if (targetName.includes('+')) {
            targetName = targetName.split("+")[0];
        }
        rel = newRelationships[i][1];
        target = domain.findElementByName(targetName, "Entity");
        if (!target) {
            throw new WarpWorksError("No matching entity '" + targetName + "' for relationship '" + rel.name + "'!");
        }
        rel.setTargetEntity(target);
        rel.updateDesc();
    }
    return domain;
};
