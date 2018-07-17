// NOTE: All this is specific to a given schema.

const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const profileImage = require('./../../../lib/user-profile/image');
const extractWorkingFor = require('./extract-working-for');
const extractUserGroups = require('./extract-user-groups');

module.exports = (persistence, entity, user) => Promise.resolve()
    .then(() => RoutesInfo.expand('entity', {
        type: user.type, // FIXME: Find the unchanging type ID.
        id: user.id
    }))
    .then((userUrl) => warpjsUtils.createResource(userUrl, {
        Name: user.Name
    }))
    .then((resource) => Promise.resolve()
        .then(() => profileImage(persistence, entity, user))
        .then((image) => resource.link('image', image || `${RoutesInfo.expand('W2:app:static')}/images/default-user.svg`))
        .then(() => extractWorkingFor(persistence, entity, user))
        .then((workingFors) => resource.embed('workingFor', workingFors))
        .then(() => extractUserGroups(persistence, entity, user, 'WGLead', true))
        .then((groups) => resource.embed('workgroups', groups))
        .then(() => extractUserGroups(persistence, entity, user, 'WGMember', false))
        .then((groups) => resource.embed('workgroups', groups))
        .then(() => extractUserGroups(persistence, entity, user, 'TGLead', true))
        .then((groups) => resource.embed('taskgroups', groups))
        .then(() => extractUserGroups(persistence, entity, user, 'TGMember', false))
        .then((groups) => resource.embed('taskgroups', groups))
        .then(() => resource)
    )
;
