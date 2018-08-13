// const debug = require('debug')('W2:portal:resources/callouts-by-paragraph');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, paragraphEntity, paragraphInstance) => Promise.resolve()
    .then(() => paragraphEntity ? paragraphEntity.getRelationshipByName('Callout') : null)
    .then((relationship) => relationship ? relationship.getDocuments(persistence, paragraphInstance) : [])
    .then((callouts) => callouts.map((callout) => {
        const resource = warpjsUtils.createResource(callout.ButtonSrc || '', {
            type: callout.type,
            id: callout.id || callout._id,
            subHeading: callout.SubHeading
        });

        resource._links.self.title = callout.ButtonLabel;

        return resource;
    }));
