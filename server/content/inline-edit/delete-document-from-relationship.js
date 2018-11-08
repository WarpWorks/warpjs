const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

module.exports = (res, req, persistence, entity, instance, body) => Promise.resolve()
    .then(() => entity.removeEmbedded(instance, body.docLevel, 0))
    .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.EMBEDDED_REMOVED, req.warpjsUser, instance, { key: body.docLevel }))
;
