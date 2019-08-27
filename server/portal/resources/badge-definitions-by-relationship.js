const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const Documents = require('./../../../lib/core/first-class/documents');
const imagesByRelationship = require('./images-by-relationship');
const serverUtils = require('./../../utils');

// const debug = require('./debug')('badge-definitions-by-relationship');

const config = serverUtils.getConfig();
const publicStatus = config.status.public;

module.exports = async (persistence, relationship, instance) => {
    const documents = await relationship.getDocuments(persistence, instance);
    const badgeDefinitions = documents.filter((doc) => publicStatus.indexOf(doc.Status) !== -1);
    const domain = relationship.getDomain();

    const bestDocuments = Documents.bestDocuments(persistence, domain, badgeDefinitions);

    const badgeDefinitionResources = await Promise.map(
        bestDocuments,
        async (badgeDefinition) => {
            const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(badgeDefinition), badgeDefinition);
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
