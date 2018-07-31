// const debug = require('debug')('W2:portal:resources/base-info-by-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => relationship.getDocuments(persistence, instance))
    .then((documents) => Promise.map(
        documents,
        (document) => Promise.resolve()
            .then(() => RoutesInfo.expand('entity', {
                type: document.type,
                id: document.id
            }))
            .then((href) => warpjsUtils.createResource(href, {
                type: document.type,
                typeLabel: relationship.getTargetEntity().label || relationship.getTargetEntity().name,
                id: document.id,
                name: document.Name,
                relnDesc: document.relnDesc,
                label: relationship.getDisplayName(document)
            }))
            .then((resource) => Promise.resolve()
                // Preview
                .then(() => resource.link('preview', RoutesInfo.expand('W2:portal:preview', { type: document.type, id: document.id })))

                .then(() => resource)
            )
    ))
    .then((documents) => documents.sort(warpjsUtils.byPositionThenName))
;
