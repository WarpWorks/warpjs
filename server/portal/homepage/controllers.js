const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const extractEntity = require('./../instance/extract-entity');
const serverUtils = require('./../../utils');

function index(req, res) {
    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendIndex(res, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence();
            const rootEntity = serverUtils.getRootEntity();

            Promise.resolve()
                .then(() => rootEntity.getDocuments(persistence))
                .then((docs) => docs[0])
                .then((doc) => {
                    const responseResource = warpjsUtils.createResource(req, {
                        id: doc.id,
                        type: doc.type,
                        name: doc.Name,
                        Name: doc.Name,
                        Desc: doc.desc
                    });

                    return Promise.resolve()
                        .then(extractEntity.bind(null, req, responseResource, persistence, rootEntity, doc))
                        .then(warpjsUtils.sendHal.bind(null, req, res, responseResource, RoutesInfo, null));
                })
                .catch((err) => warpjsUtils.sendError(req, res, RoutesInfo, err))
                .finally(() => {
                    persistence.close();
                });
        }
    });
}

module.exports = {
    index
};
