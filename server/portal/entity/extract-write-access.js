// const debug = require('debug')('I3C:Portal:entity:extractWriteAccess');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const config = require('./../config');

module.exports = (req, responseResource, persistence, hsEntity, instance) => {
    return Promise.resolve()
        .then(() => hsEntity.canBeEditedBy(persistence, instance, req.i3cUser))
        .then((canWrite) => {
            if (canWrite) {
                responseResource.link('edit', {
                    href: RoutesInfo.expand('W2:content:entity', {
                        domain: config.domainName,
                        type: instance.type,
                        oid: instance.id, // FIXME: debug
                        id: instance.id
                    }),
                    title: `Edit "${instance.Name}"`
                });
            }
        });
};
