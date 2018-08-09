// const debug = require('debug')('W2:portal:resources/header-image-by-entity');
const Promise = require('bluebird');

const imagesByRelationship = require('./images-by-relationship');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => entity.getRelationshipByName('HeaderImage'))
    .then((relationship) => imagesByRelationship(persistence, relationship, instance))
;
