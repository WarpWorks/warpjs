const Persistence = require('@warp-works/warpjs-mongo-persistence');
const Promise = require('bluebird');

const config = require('./../config');
const extractEntity = require('./../entity/extract-entity');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function index(req, res) {
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Entity', 'portal'),

        [utils.HAL_CONTENT_TYPE]: () => {
            const persistence = new Persistence(config.persistence.host, config.domainName);

            Promise.resolve()
                .then(() => warpCore.getDomainByName(config.domainName))
                .then((domain) => domain.getRootInstance())
                .then((rootEntity) => {
                    return rootEntity.getDocuments(persistence)
                        .then((docs) => docs[0])
                        .then((doc) => {
                            const responseResource = utils.createResource(req, {
                                id: doc.id,
                                type: doc.type,
                                name: doc.Name,
                                Name: doc.Name,
                                Desc: doc.desc
                            });

                            return Promise.resolve()
                                .then(extractEntity.bind(null, req, responseResource, persistence, rootEntity, doc))
                                .then(utils.sendHal.bind(null, req, res, responseResource, null));
                        });
                })
                .catch(utils.sendError.bind(null, req, res))
                .finally(() => {
                    persistence.close();
                });
        }
    });
}

module.exports = {
    index
};
