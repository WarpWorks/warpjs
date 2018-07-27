const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const imageAreasByImage = require('./image-areas-by-image');

module.exports = (persistence, paragraph, instance) => Promise.resolve()
    .then(() => paragraph.getRelationshipByName('Images'))
    .then((relationship) => Promise.resolve()
        .then(() => relationship.getDocuments(persistence, instance))
        .then((images) => Promise.map(images, (image) => Promise.resolve()
            .then(() => image.ImageURL || '')
            .then((href) => warpjsUtils.createResource(href, {
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
    )
;
