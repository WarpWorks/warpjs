// const debug = require('debug')('W2:portal:resources/preview-image-by-entity');
const Promise = require('bluebird');

const overviewByEntity = require('./overview-by-entity');

module.exports = (persistence, entity, instance) => Promise.resolve()
    // .then(() => debug(`relationships=`, entity.getRelationships().map((reln) => reln.name)))
    .then(() => entity ? entity.getRelationshipByName('PreviewImage') : null)
    .then((relationship) => relationship
        ? Promise.resolve()
            // .then(() => debug("relationship=", relationship))
            .then(() => relationship.getDocuments(persistence, instance))
            .then((previewImages) => previewImages && previewImages.length
                ? Promise.resolve()
                    .then(() => previewImages[0])
                    .then((previewImage) => previewImage && previewImage.ImageURL ? previewImage.ImageURL : null)
                : null
            )
        : null
    )
    .then((imageUrl) => imageUrl
        ? Promise.resolve()
            .then(() => imageUrl)
        : Promise.resolve()
            .then(() => overviewByEntity(persistence, entity, instance))
            .then((overview) => overview && overview._embedded ? overview._embedded.items : null)
            .then((paragraphs) => paragraphs && paragraphs.length ? paragraphs[0] : null)
            .then((paragraph) => paragraph && paragraph._embedded ? paragraph._embedded.images : null)
            .then((images) => images && images.length ? images[0] : null)
            .then((image) => image && image._links ? image._links.self : null)
            .then((link) => link ? link.href : null)
    )
;
