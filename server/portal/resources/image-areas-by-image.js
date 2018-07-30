// const debug = require('debug')('W2:portal:resources/image-areas-by-image');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
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
                    // debug(`target=`, target);
                    if (target) {
                        imageAreaResource.link('target', {
                            title: image.getDisplayName(target),
                            href: RoutesInfo.expand('entity', {
                                type: target.type,
                                id: target.id
                            })
                        });

                        imageAreaResource.link('preview', {
                            title: `Preview for '${image.getDisplayName(target)}'`,
                            href: RoutesInfo.expand('W2:portal:preview', {
                                type: target.type,
                                id: target.id
                            })
                        });
                    }
                })
                .then(() => imageAreaResource)
            )
        ))
    )
;
