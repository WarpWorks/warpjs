// const debug = require('debug')('W2:portal:resources/header-image-by-entity');
const Promise = require('bluebird');

const imagesByRelationship = require('./images-by-relationship');
const imageTypes = require('./../../../lib/core/image-types');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => entity.getRelationshipByName('Images'))
    .then((relationship) => relationship ? imagesByRelationship(persistence, relationship, instance, imageTypes.HEADER_IMAGE) : null)
    .then((images) => images && images.length ? images[0] : null)
;
