// NOTE: This module is not generic and expect a very specific schema
// definition.

const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, entity, user) => Promise.resolve()
    .then(() => entity.getRelationshipByName('WorkingFor'))
    .then((relationship) => relationship.getDocuments(persistence, user))
    .then((workingFors) => workingFors.map((workingFor) => {
        const workingForUrl = RoutesInfo.expand('entity', workingFor);
        return warpjsUtils.createResource(workingForUrl, {
            Name: workingFor.Name,
            CompanyName: workingFor.CompanyName
        });
    }))
;
