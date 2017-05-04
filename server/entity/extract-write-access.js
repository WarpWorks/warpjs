// const debug = require('debug')('I3C:Portal:entity:extractWriteAccess');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

module.exports = (req, responseResource, persistence, hsEntity, instance) => {
    return Promise.resolve()
        .then(() => hsEntity.canBeEditedBy(persistence, instance, req.i3cUser))
        .then((canWrite) => {
            if (canWrite) {
                responseResource.link('edit', {
                    href: RoutesInfo.expand('w2-app:app', { type: instance.type, oid: instance.id }),
                    title: `Edit "${instance.Name}"`
                });
            }
        });
};
