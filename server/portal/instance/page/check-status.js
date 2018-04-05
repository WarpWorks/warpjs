const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/page/check-status');
const Promise = require('bluebird');

const serverUtils = require('./../../../utils');

module.exports = (req, persistence, entity, instance) => {
    const status = {};

    const config = serverUtils.getConfig();
    const instanceStatus = instance[config.status.property];

    return Promise.resolve()
        .then(() => _.indexOf(config.status.public, instanceStatus) !== -1)
        .then((isPublic) => {
            _.extend(status, { isPublic });
            return isPublic;
        })

        .then((isPublic) => isPublic || serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
        .then((isVisible) => _.extend(status, { isVisible }))

        .then(() => _.indexOf(config.status.disclaimer, instanceStatus) !== -1)
        .then((showDisclaimer) => _.extend(status, { showDisclaimer }))

        .then(() => status)
    ;
};
