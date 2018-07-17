const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/page/check-status');
const Promise = require('bluebird');

const computeDocumentStatus = require('./compute-document-status');
const serverUtils = require('./../../utils');

module.exports = (req, persistence, entity, instance) => {
    const status = {};

    const config = serverUtils.getConfig();

    return Promise.resolve()
        .then(() => computeDocumentStatus(config.status, persistence, entity, instance))
        .then((documentStatus) => Promise.resolve()
            .then(() => _.extend(status, { documentStatus }))

            .then(() => _.indexOf(config.status.public, documentStatus) !== -1)
            .then((isPublic) => {
                _.extend(status, { isPublic });
                return isPublic;
            })

            .then((isPublic) => isPublic || serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
            .then((isVisible) => _.extend(status, { isVisible }))

            .then(() => _.indexOf(config.status.disclaimer, documentStatus) !== -1)
            .then((showDisclaimer) => _.extend(status, { showDisclaimer }))
        )

        .then(() => status)
    ;
};
