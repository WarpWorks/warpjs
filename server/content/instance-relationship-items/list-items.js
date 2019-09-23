const warpjsUtils = require('@warp-works/warpjs-utils');

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

        // Get potential target entities.
        const targetEntity = relationshipInstance.getTargetEntity();
        const allTargetEntities = [ targetEntity ].concat(targetEntity.getChildEntities(true, true));

        resource.embed('entities', allTargetEntities.map((entity) => ({
            name: entity.name,
            id: entity.id,
            label: entity.getDisplayName(entity),
            isAbstract: entity.isAbstract
        })));

        let items;
        if (relationshipInstance.isAggregation) {
            items = await listAggregationItems(persistence, relationshipInstance, document);
        } else {
            throw new Error(`This is not implemented yet.`);
        }

        if (items && items.length) {
            resource.embed('items', items);
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
