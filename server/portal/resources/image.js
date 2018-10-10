// const debug = require('debug')('W2:portal:resources/image');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const imageAreasByImage = require('./image-areas-by-image');

module.exports = (persistence, imageEntity, imageInstance) => Promise.resolve()
    .then(() => imageInstance.ImageURL || '')
    .then((href) => warpjsUtils.createResource(href, {
        type: imageInstance.type,
        id: imageInstance.id || imageInstance._id,
        name: imageInstance.AltText || imageInstance.Caption,
        description: imageInstance.Caption,
        width: imageInstance.Width,
        height: imageInstance.Height,
        imageType: imageInstance.Type,
        imageBackground: imageInstance.ImageBackground || 'Transparent'
    }))
    .then((imageResource) => Promise.resolve()
        // HRef
        .then(() => {
            if (imageInstance.HRef) {
                imageResource.link('href', imageInstance.HRef);
            }
        })

        // Target
        .then(() => imageEntity.getRelationshipByName('Target'))
        .then((relationship) => Promise.resolve()
            .then(() => relationship ? relationship.getDocuments(persistence, imageInstance) : [])
            .then((targets) => targets && targets.length ? targets[0] : null)
            .then((target) => {
                if (target) {
                    const href = RoutesInfo.expand('entity', target);
                    imageResource.link('target', {
                        href,
                        title: relationship.getDisplayName(target)
                    });
                }
            })
        )

        // Map
        .then(() => imageAreasByImage(persistence, imageEntity, imageInstance))
        .then((imageAreas) => imageResource.embed('imageAreas', imageAreas))

        .then(() => imageResource)
    )
;
