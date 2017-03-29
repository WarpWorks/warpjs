// const debug = require('debug')('HS:entity:extractWriteAccess');
const Promise = require('bluebird');
const url = require('url');

module.exports = (req, responseResource, persistence, hsEntity, instance) => {
    return Promise.resolve()
        .then(() => hsEntity.canBeEditedBy(persistence, instance, req.i3cUser))
        .then((canWrite) => {
            if (canWrite) {
                const href = url.format({
                    protocol: req.protocol,
                    port: 3001,
                    hostname: req.hostname,
                    pathname: `/app/${instance.type}`,
                    query: {
                        oid: instance.id
                    }
                });
                responseResource.link('edit', {
                    href,
                    title: `Edit "${instance.Name}"`
                });
            }
        });
};
