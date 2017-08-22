const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

function documentMapper(domain, instance) {
    const documentUrl = RoutesInfo.expand('W2:content:entity', {
        domain,
        type: instance.type,
        oid: instance.id, // FIXME: debug
        id: instance.id
    });
    return warpjsUtils.createResource(documentUrl, {
        isRootInstance: instance.isRootInstance || undefined,
        id: instance.id,
        type: instance.type,
        name: instance.name || instance.Name || `${instance.type}[${instance.id}]`
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
