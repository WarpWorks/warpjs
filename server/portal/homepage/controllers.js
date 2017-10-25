const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const serverUtils = require('./../../utils');

function index(req, res) {
    const persistence = serverUtils.getPersistence();
    const rootEntity = serverUtils.getRootEntity();

    Promise.resolve()
        .then(() => rootEntity.getDocuments(persistence))
        .then((docs) => docs[0])
        .then((doc) => {
            const url = RoutesInfo.expand('entity', doc);
            res.redirect(url);
        })
        .catch((err) => serverUtils.sendError(req, res, err))
        .finally(() => persistence.close())
    ;
}

module.exports = {
    index
};
