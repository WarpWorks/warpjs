const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./../../../lib/constants/routes');

// const debug = require('./debug')('get-types');

const isDocumentAggregation = (relationship, entity) => {
    const target = relationship.getTargetEntity();
    if (!target.isContent()) {
        return false;
    }

    // Be sure that the target is a match with the current document's entity.
    if (entity.id === target.id) {
        return true;
    } else if (entity.hasParentClass()) {
        return isDocumentAggregation(relationship, entity.getParentClass());
    } else {
        return false;
    }

};

module.exports = async (req, persistence, document, parentData) => {
    const domainInstance = parentData.entity.getDomain();

    const documentEntity = domainInstance.getEntityByInstance(document);

    const entities = domainInstance.getEntities();
    const documentEntities = entities.filter((entity) => {
        if (!entity.isDocument()) {
            return false;
        } else if (entity.isAbstract) {
            return false;
        } else {

            return entity.getAggregations().reduce(
                (isAggregation, relationship) => isAggregation || isDocumentAggregation(relationship, documentEntity),
                false
            );
        }
    });

    return documentEntities.map((entity) => {
        const resource = warpjsUtils.createResource(
            RoutesInfo.expand(routes.content.changeParent, {
                domain: domainInstance.name,
                type: document.type,
                id: document.id,
                entity: entity.name
            }),
            {
                id: entity.id,
                name: entity.name,
                selected: entity.id === parentData.entity.id
            },
            req
        );

        resource.embed('aggregations', entity.getAggregations().reduce(
            (aggregations, relationship) => {
                if (isDocumentAggregation(relationship, documentEntity)) {
                    return aggregations.concat(warpjsUtils.createResource('', {
                        id: relationship.id,
                        name: relationship.name
                    }));
                } else {
                    return aggregations;
                }
            },
            []
        ));

        return resource;
    });
};
