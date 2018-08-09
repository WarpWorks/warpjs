const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const imageAreasByImage = require('./image-areas-by-image');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => relationship ? relationship.getDocuments(persistence, instance) : [])
    .then((images) => Promise.map(
        images,
        (image) => Promise.resolve()
            .then(() => image.ImageURL || '')
            .then((href) => warpjsUtils.createResource(href, {
                type: image.type,
                id: image._id,
                name: image.altText,
                description: image.Caption,
                width: image.Width,
                height: image.Height
            }))
            .then((imageResource) => Promise.resolve()
                .then(() => imageAreasByImage(persistence, relationship.getTargetEntity(), image))
                .then((imageAreas) => imageResource.embed('imageAreas', imageAreas))
                .then(() => imageResource)
            )
    ))
;
