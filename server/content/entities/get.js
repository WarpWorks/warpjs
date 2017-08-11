const Promise = require('bluebird');
// const debug = require('debug')('W2:content:entities:get');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

function documentMapper(domain, document) {
    const documentUrl = RoutesInfo.expand('W2:content:entity', {
        domain,
        type: document.type,
        oid: document.id, // FIXME: debug
        id: document.id
    });
    return warpjsUtils.createResource(documentUrl, {
        isRootInstance: document.isRootInstance || undefined,
        id: document.id,
        type: document.type,
        name: document.name || document.Name || document.type
    });
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type} - Entities`
    });
    res.format({
        html() {
            utils.basicRender(
                [
                    `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/entities.js`
                ],
                resource,
                req,
                res
            );
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            resource.link('domain', {
                title: domain,
                href: RoutesInfo.expand('W2:content:domain', {
                    domain
                })
            });

            resource.link('type', {
                title: type,
                href: RoutesInfo.expand('W2:content:entities', {
                    domain,
                    type
                })
            });

            const persistence = serverUtils.getPersistence(domain);
            const entity = serverUtils.getEntity(domain, type);

            return Promise.resolve()
                .then(() => entity.getDocuments(persistence))
                .then((documents) => {
                    // debug('documents=', JSON.stringify(documents, null, 2));
                    const embedded = documents.map(documentMapper.bind(null, domain));
                    resource.embed('entities', embedded);
                })
                .then(() => utils.sendHal(req, res, resource))
                .finally(() => {
                    persistence.close();
                });
        }
    });
};
