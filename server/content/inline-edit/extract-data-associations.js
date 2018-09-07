// const debug = require('debug')('W2:content:inline-edit/extract-data-associations');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        type: relationship.type,
        id: relationship.id,
        name: relationship.label || relationship.name,
        description: relationship.desc,
        reference: {
            type: relationship.type,
            id: relationship.id,
            name: relationship.name
        }
    }))
    .then((resource) => Promise.resolve()
        .then(() => resource)
    )
;
