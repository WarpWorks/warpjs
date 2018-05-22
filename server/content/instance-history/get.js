const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    res.format({
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence(domain);

            const resource = warpjsUtils.createResource(req, {
                title: `Domain ${domain} - Type ${type} - Id ${id} - History`,
                domain,
                type,
                id
            });

            Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => entity.getInstance(persistence, id))
                .then((instance) => ChangeLogs.toFormResource(domain, persistence, instance))
                .then((changeLogs) => resource.embed('changeLogs', changeLogs))
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => {
                    resource.error = true;
                    resource.message = err.message;
                    utils.sendHal(req, res, resource, 500);
                })
                .finally(() => persistence.close())
            ;
        }
    });
};
