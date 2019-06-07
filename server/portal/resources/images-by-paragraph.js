const Promise = require('bluebird');

const imagesByRelationship = require('./images-by-relationship');

module.exports = (persistence, paragraph, instance) => Promise.resolve()
    .then(() => paragraph.getRelationshipByName('Images'))
    .then((relationship) => imagesByRelationship(persistence, relationship, instance))
    .then((images) => images && images.length ? [images[0]] : [])
;
