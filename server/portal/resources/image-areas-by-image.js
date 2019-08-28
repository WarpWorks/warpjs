const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const ImageAreaShapes = require('./../../../lib/core/image-area-shapes');
const routes = require('./../../../lib/constants/routes');

const debug = require('./debug')('image-areas-by-image');

function defineRect(imageAreaResource) {
    const coords = (imageAreaResource.coords || '').split(',');
    if (coords.length === 4) {
        imageAreaResource.x = parseInt(coords[0], 10);
        imageAreaResource.y = parseInt(coords[1], 10);
        imageAreaResource.w = parseInt(coords[2], 10) - imageAreaResource.x;
        imageAreaResource.h = parseInt(coords[3], 10) - imageAreaResource.y;
        imageAreaResource.isRect = true;
        imageAreaResource.showArea = true;
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
        imageAreaResource.showArea = true;
    } else {
        debug(`        Invalid Circle: coords=${imageAreaResource.coords}`);
    }
}

module.exports = async (persistence, image, instance) => {
    const domain = image.getDomain();

    const relationship = image.getRelationshipByName('Map');
    const imageAreas = await relationship.getDocuments(persistence, instance);

    return Promise.map(
        imageAreas,
        async (imageArea) => {
            const href = imageArea.HRef || '';
            const imageAreaResource = warpjsUtils.createResource(href, {
                name: imageArea.Title,
                coords: imageArea.Coords,
                alt: imageArea.Alt,
                shape: imageArea.Shape
            });

            if (imageAreaResource.shape === ImageAreaShapes.Rect) {
                // debug(`    Is Rect`);
                defineRect(imageAreaResource);
            } else if (imageAreaResource.shape === ImageAreaShapes.Circle) {
                // debug(`    Is Circle`);
                defineCircle(imageAreaResource);
            } else if (imageAreaResource.coords) {
                // debug(`    Assuming Rect`);
                const coords = imageAreaResource.coords.split(',');
                if (coords.length === 4) {
                    defineRect(imageAreaResource);
                } else if (coords.length === 3) {
                    defineCircle(imageAreaResource);
                }
            } else {
                debug(`    *** TODO: Unknown shape=${imageAreaResource.shape}; coords=${imageAreaResource.coords}`);
            }

            const targetRelationship = relationship.getTargetEntity().getRelationshipByName('Target');
            const targets = await targetRelationship.getDocuments(persistence, imageArea);
            const target = targets.pop();

            if (target) {
                const bestDocument = await Document.bestDocument(persistence, domain.getEntityByInstance(target), target);
                const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(bestDocument), bestDocument);

                imageAreaResource.link('target', {
                    title: image.getDisplayName(target),
                    href
                });

                imageAreaResource.link('preview', {
                    title: `Preview for '${image.getDisplayName(bestDocument)}'`,
                    href: RoutesInfo.expand(routes.portal.preview, {
                        type: bestDocument.type,
                        id: bestDocument.id
                    })
                });
            }

            return imageAreaResource;
        }
    );
};
