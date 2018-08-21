const debug = require('debug')('W2:portal:resources/image-areas-by-image');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ImageAreaShapes = require('./../../../lib/core/image-area-shapes');

function defineRect(imageAreaResource) {
    const coords = (imageAreaResource.coords || '').split(',');
    if (coords.length === 4) {
        imageAreaResource.x = parseInt(coords[0], 10);
        imageAreaResource.y = parseInt(coords[1], 10);
        imageAreaResource.w = parseInt(coords[2], 10) - imageAreaResource.x;
        imageAreaResource.h = parseInt(coords[3], 10) - imageAreaResource.y;
        imageAreaResource.isRect = true;
    } else {
        debug(`       Invalid Rect: coords=${imageAreaResource.coords}`);
    }
}

function defineCircle(imageAreaResource) {
    const coords = (imageAreaResource.coords || '').split(',');
    if (coords.length === 3) {
        imageAreaResource.cx = parseInt(coords[0], 10);
        imageAreaResource.cy = parseInt(coords[1], 10);
        imageAreaResource.r = parseInt(coords[2], 10);
        imageAreaResource.isCircle = true;
    } else {
        debug(`        Invalid Circle: coords=${imageAreaResource.coords}`);
    }
}

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
                // .then(() => debug(`shape=`, imageAreaResource.shape))
                .then(() => {
                    if (imageAreaResource.shape === ImageAreaShapes.Rect) {
                        debug(`    Is Rect`);
                        defineRect(imageAreaResource);
                    } else if (imageAreaResource.shape === ImageAreaShapes.Circle) {
                        debug(`    Is Circle`);
                        defineCircle(imageAreaResource);
                    } else if (imageAreaResource.coords) {
                        debug(`    Assuming Rect`);
                        defineRect(imageAreaResource);
                    } else {
                        debug(`    *** TODO: Unknown shape=${imageAreaResource.shape}; coords=${imageAreaResource.coords}`);
                    }
                })

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
