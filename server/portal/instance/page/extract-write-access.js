const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const serverUtils = require('./../../../utils');

module.exports = (req, responseResource, persistence, entity, instance) => Promise.resolve()
    .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
    .then((canWrite) => {
        if (canWrite) {
            const config = serverUtils.getConfig();

            responseResource.link('edit', {
                href: RoutesInfo.expand('W2:content:instance', {
                    domain: config.domainName,
                    type: instance.type,
                    id: instance.id
                }),
                title: `Edit "${instance.Name}"`
            });
        }
    })
;
