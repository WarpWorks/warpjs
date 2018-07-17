const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const serverUtils = require('./../../utils');

module.exports = (req, res) => Promise.resolve()
    .then(() => serverUtils.getPersistence())
    .then((persistence) => Promise.resolve()
        .then(() => serverUtils.getRootEntity())
        .then((rootEntity) => rootEntity.getDocuments(persistence))
        .then((docs) => docs[0])
        .then((doc) => {
            const url = RoutesInfo.expand('entity', doc);
            res.redirect(url);
        })
        .finally(() => persistence.close())
    )
    .catch((err) => serverUtils.sendError(req, res, err))
;
