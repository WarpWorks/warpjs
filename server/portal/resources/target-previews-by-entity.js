// const debug = require('debug')('W2:portal:resources/target-previews-by-entity');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const itemsWalkByEntity = require('./items-walk-by-entity');
const routes = require('./../../../lib/constants/routes');

const RELATIONSHIP_NAMES = [
    'Overview',
    'Images',
    'Map',
    'Target'
];

module.exports = async (persistence, entity, instance) => {
    const domain = entity.getDomain();

    const targetPreviews = entity ? await itemsWalkByEntity(persistence, entity, instance, RELATIONSHIP_NAMES) : [];

    return Promise.map(
        targetPreviews,
        async (targetPreview) => {
            const bestDocument = await Document.bestDocument(persistence, domain.getEntityByInstance(targetPreview.instance), targetPreview.instance);

            const relationship = targetPreview.entity.getRelationshipByName('Overview');
            const paragraphs = await relationship.getDocuments(persistence, bestDocument);
            const paragraph = paragraphs && paragraphs.length ? paragraphs[0] : null;
            const content = paragraph ? paragraph.Content : null;

            const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(bestDocument), bestDocument);

            const resource = warpjsUtils.createResource(href, {
                title: targetPreview.entity.getDisplayName(bestDocument),
                content
            });

            resource.link('preview', {
                title: targetPreview.entity.getDisplayName(bestDocument),
                href: RoutesInfo.expand(routes.portal.preview, {
                    type: bestDocument.type,
                    id: bestDocument.id
                })
            });

            return resource;
        }
    );
};
