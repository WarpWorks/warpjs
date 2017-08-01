const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const config = require('./../config');
const extractEntity = require('./../entity/extract-entity');
const warpjsUtils = require('@warp-works/warpjs-utils');
const warpCore = require('./../../../lib/core');

function index(req, res) {
    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendIndex(res, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const Persistence = require(config.persistence.module);
            const persistence = new Persistence(config.persistence.host, config.domainName);

            Promise.resolve()
                .then(() => warpCore.getDomainByName(config.domainName))
                .then((domain) => domain.getRootInstance())
                .then((rootEntity) => {
                    return rootEntity.getDocuments(persistence)
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
                        });
                })
                .catch(warpjsUtils.sendError.bind(null, req, res))
                .finally(() => {
                    persistence.close();
                });
        }
    });
}

module.exports = {
    index
};
