const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, entity, user, relationshipName, isLeader) => Promise.resolve()
    .then(() => entity.getRelationshipByName(relationshipName))
    .then((relationship) => relationship.getDocuments(persistence, user))
    .then((workgroups) => workgroups.map((workgroup) => {
        const workgroupUrl = RoutesInfo.expand('entity', workgroup);
        return warpjsUtils.createResource(workgroupUrl, {
            Name: workgroup.Name,
            isLeader
        });
    }))
;
