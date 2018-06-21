const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

module.exports = (req, res, persistence, entity, instance) => Promise.resolve()
    .then(() => entity.removeEmbedded(instance, req.body.docLevel, 0))
    .then(() => ChangeLogs.add(ChangeLogs.ACTION.EMBEDDED_REMOVED, req.warpjsUser, instance, { key: req.body.docLevel }))
    .then(() => entity.updateDocument(persistence, instance))
;
