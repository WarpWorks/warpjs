const debug = require('debug')('W2:portal:resources/extract-image-areas-from-image');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, image, instance) => Promise.resolve()
    .then(() => image.getRelationshipByName('Map'))
    .then((relationship) => Promise.resolve()
        .then(() => relationship.getDocuments(persistence, instance))
        .then((imageAreas) => Promise.map(imageAreas, (imageArea) => Promise.resolve()
            .then(() => imageArea.HRef || '')
            .then((href) => warpjsUtils.createResource(href, {
                name: imageArea.Title,
                coords: imageArea.Coords,
                alt: imageArea.Alt,
                shape: imageArea.Shape
            }))
            .then((imageAreaResource) => Promise.resolve()
                .then(() => relationship.getTargetEntity().getRelationshipByName('Target'))
                .then((targetRelationship) => targetRelationship.getDocuments(persistence, imageArea))
                .then((targets) => targets.pop())
                .then((target) => {
                    debug(`target=`, target);
                    if (target) {
                    }
                })
                .then(() => imageAreaResource)
            )
        ))
    )
;
