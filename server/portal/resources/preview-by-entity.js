const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const overviewByEntity = require('./overview-by-entity');
const previewImageByEntity = require('./preview-image-by-entity');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => RoutesInfo.expand('entity', {
        type: instance.type,
        id: instance.id
    }))
    .then((href) => warpjsUtils.createResource(href, {
        type: instance.type,
        typeLabel: entity.getDomain().getEntityLabelByEntityName(instance.type),
        id: instance.id,
        name: instance.Name,
        label: instance.Label || instance.Name
    }))
    .then((resource) => Promise.resolve()
        .then(() => RoutesInfo.expand('W2:portal:preview', {
            type: instance.type,
            id: instance.id
        }))
        .then((previewHref) => resource.link('preview', previewHref))

        .then(() => overviewByEntity(persistence, entity, instance))
        .then((overview) => overview && overview._embedded ? overview._embedded.items : null)
        .then((paragraphs) => paragraphs && paragraphs.length ? paragraphs[0] : null)
        .then((paragraph) => Promise.resolve()
            .then(() => paragraph ? paragraph.description : null)
            .then((description) => {
                if (description) {
                    resource.description = description;
                }
            })

            .then(() => previewImageByEntity(persistence, entity, instance))
            .then((previewImageUrl) => {
                if (previewImageUrl) {
                    resource.link('image', previewImageUrl);
                }
            })
        )
        .then(() => resource)
    )
;
