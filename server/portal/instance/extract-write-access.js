const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const config = require('./../config');

module.exports = (req, responseResource, persistence, entity, instance, isPreview) => {
    if (!isPreview) {
        return Promise.resolve()
            .then(() => entity.canBeEditedBy(persistence, instance, req.warpjsUser))
            .then((canWrite) => {
                if (canWrite) {
                    responseResource.link('edit', {
                        href: RoutesInfo.expand('W2:content:instance', {
                            domain: config.domainName,
                            type: instance.type,
                            id: instance.id
                        }),
                        title: `Edit "${instance.Name}"`
                    });
                }
            });
    }
};
