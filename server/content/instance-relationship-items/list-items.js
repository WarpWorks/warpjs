const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const AggregationFilters = require('./../../../lib/core/first-class/aggregation-filters');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

// const debug = require('./debug')('list-items');
const listAggregationItems = require('./list-items-aggregation');

module.exports = async (req, res) => {
    const { domain, type, id, relationship } = req.params;

    const resource = warpjsUtils.createResource(
        req,
        {
            domain,
            type,
            id,
            relationship,
            description: `List items for relationship '${relationship}'.`
        },
        req
    );

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entityInstance = await serverUtils.getEntity(domain, type);
        if (!entityInstance) {
            throw new Error(`Cannot find entity '${type}'.`);
        }
        const document = await entityInstance.getInstance(persistence, id);
        if (!document || !document.id) {
            throw new Error(`Cannot find document '${type}/${id}'.`);
        }

        const relationshipInstance = entityInstance.getRelationshipByName(relationship);
        if (!relationshipInstance) {
            throw new Error(`Cannot find relationship '${type}/${relationship}'.`);
        }

        if (relationshipInstance.isAggregation) {
            // Get potential target entities.
            const targetEntity = relationshipInstance.getTargetEntity();
            const allTargetEntities = [ targetEntity ].concat(targetEntity.getChildEntities(true, true));

            resource.embed('entities', allTargetEntities.map((entity) => ({
                name: entity.name,
                id: entity.id,
                label: entity.getDisplayName(entity),
                isAbstract: entity.isAbstract
            })));

            // Find all associations that can be used for filters. All
            // associations with the same target entity are grouped together.
            //
            //      associations = [{
            //          id: <targetEntityID>,
            //          name: <targetEntityName>
            //          relationships: [{
            //              id: <relationshipId>,
            //              name: <relationshipName>,
            //              label: <relationshipLabel>
            //          }]
            //      }];
            const associations = allTargetEntities.reduce(
                (cumulator, targetEntity) => {
                    const relationships = targetEntity.getRelationships();
                    const associationRelationships = relationships.filter((relationship) => !relationship.isAggregation && !relationship.isReverse());

                    return associationRelationships.reduce(
                        (cumulator, association) => {
                            const associationInfo = {
                                id: association.id,
                                name: association.name,
                                label: association.label,
                                url: RoutesInfo.expand(routes.content.aggregationFilters, { domain, type, id, relationship })
                            };

                            const associationTarget = association.getTargetEntity();
                            if (associationTarget.isAbstract) {
                                return cumulator;
                            } else {
                                const foundEntity = cumulator.find((cumulatedEntity) => cumulatedEntity.id === associationTarget.id);
                                if (foundEntity) {
                                    const foundRelationship = foundEntity.relationships.find((reln) => reln.id === association.id);
                                    if (!foundRelationship) {
                                        foundEntity.relationships.push(associationInfo);
                                    }
                                    return cumulator;
                                } else {
                                    return cumulator.concat({
                                        id: associationTarget.id,
                                        name: associationTarget.name,
                                        label: associationTarget.label,
                                        relationships: [ associationInfo ]
                                    });
                                }
                            }
                        },
                        cumulator
                    );
                },
                []
            );
            if (associations && associations.length) {
                resource.embed('associations', associations);
            }

            const items = await listAggregationItems(persistence, relationshipInstance, document);
            if (items && items.length) {
                resource.embed('items', items);
            }

            const aggregationFilters = AggregationFilters.getRelationshipFilter(document, relationshipInstance.id);
            if (aggregationFilters) {
                resource.embed('aggregationFilters', aggregationFilters.entities);
            }
        } else {
            throw new Error(`This is not implemented yet.`);
        }

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`list-items ERROR: err=`, err);
        resource.message = err.message;
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
