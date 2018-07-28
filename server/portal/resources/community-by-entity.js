// const debug = require('debug')('W2:portal:resources/community-by-entity');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const usersByRelationship = require('./users-by-relationship');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
    }))
    .then((resource) => Promise.resolve()
        .then(() => entity.getRelationshipByName('Authors'))
        .then((relationship) => usersByRelationship(persistence, relationship, instance))
        .then((authors) => {
            if (authors && authors.length) {
                resource.showPanel = true;
                resource.embed('authors', authors);
            }
        })

        .then(() => entity.getRelationshipByName('Contributors'))
        .then((relationship) => usersByRelationship(persistence, relationship, instance))
        .then((contributors) => {
            if (contributors && contributors.length) {
                resource.showPanel = true;
                resource.embed('contributors', contributors);
            }
        })

        .then(() => resource)
    )
;
