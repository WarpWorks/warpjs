const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');

module.exports = (req, res, persistence, entity, instance) => Promise.resolve()
    .then(() => entity.removeEmbedded(instance, req.body.docLevel, 0))
    .then(() => ChangeLogs.removeEmbedded(req, instance, req.body.docLevel))
    .then(() => entity.updateDocument(persistence, instance))
;
