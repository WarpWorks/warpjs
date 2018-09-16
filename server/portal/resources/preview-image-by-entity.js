// const debug = require('debug')('W2:portal:resources/preview-image-by-entity');
const Promise = require('bluebird');

const imageTypes = require('./../../../lib/core/image-types');
const imagesByRelationship = require('./images-by-relationship');
const overviewByEntity = require('./overview-by-entity');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => entity ? entity.getRelationshipByName('Images') : null)
    .then((relationship) => relationship ? imagesByRelationship(persistence, relationship, instance, imageTypes.PREVIEW_IMAGE) : null)
    .then((images) => images && images.length ? images[0] : null)
    .then((image) => image
        ? image._links.self.href
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
