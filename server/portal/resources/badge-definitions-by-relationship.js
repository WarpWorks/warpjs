// const debug = require('debug')('W2:portal:resources/badge-definitions-by-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const imagesByRelationship = require('./images-by-relationship');
const routes = require('./../../../lib/constants/routes');

module.exports = async (persistence, relationship, instance) => {
    const badgeDefinitions = await relationship.getDocuments(persistence, instance);

    const badgeDefinitionResources = await Promise.map(
        badgeDefinitions,
        async (badgeDefinition) => {
            const href = RoutesInfo.expand(routes.portal.entity, badgeDefinition);
            const resource = warpjsUtils.createResource(href, {
                type: badgeDefinition.type,
                typeID: badgeDefinition.typeID,
                id: badgeDefinition.id,
                name: relationship.getDisplayName(badgeDefinition)
            });

            const entity = relationship.getDomain().getEntityByInstance(badgeDefinition);
            const imagesRelationship = entity.getRelationshipByName('Images');

            const images = await imagesByRelationship(persistence, imagesRelationship, badgeDefinition);
            if (images && images.length) {
                resource.embed('images', images);

                // By default, assume no stars.
                const image = images.find((image) => image.name === 'star0');
                if (image) {
                    resource.link('image', image._links.self.href);
                }
            }

            return resource;
        }
    );

    return badgeDefinitionResources;
};
