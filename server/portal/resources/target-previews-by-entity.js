// const debug = require('debug')('W2:portal:resources/target-previews-by-entity');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const itemsWalkByEntity = require('./items-walk-by-entity');

const RELATIONSHIP_NAMES = [
    'Overview',
    'Images',
    'Map',
    'Target'
];

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => entity ? itemsWalkByEntity(persistence, entity, instance, RELATIONSHIP_NAMES) : [])
    .then((targetPreviews) => Promise.map(
        targetPreviews,
        (targetPreview) => Promise.resolve()
            .then(() => targetPreview.entity.getRelationshipByName('Overview'))
            .then((relationship) => relationship.getDocuments(persistence, targetPreview.instance))
            .then((paragraphs) => paragraphs && paragraphs.length ? paragraphs[0] : null)
            .then((paragraph) => paragraph ? paragraph.Content : null) // FIXME: Hard-coded.
            .then((content) => {
                const href = RoutesInfo.expand('entity', {
                    type: targetPreview.instance.type,
                    id: targetPreview.instance.id
                });

                const resource = warpjsUtils.createResource(href, {
                    title: targetPreview.entity.getDisplayName(targetPreview.instance),
                    content
                });

                resource.link('preview', {
                    href: RoutesInfo.expand('W2:portal:preview', {
                        type: targetPreview.instance.type,
                        id: targetPreview.instance.id
                    }),
                    title: targetPreview.entity.getDisplayName(targetPreview.instance)
                });

                return resource;
            })
    ))
;
