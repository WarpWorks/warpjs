const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    res.format({
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence(domain);
            const entity = serverUtils.getEntity(domain, type);

            const resource = warpjsUtils.createResource(req, {
                title: `Domain ${domain} - Type ${type} - Id ${id} - History`,
                domain,
                type,
                id
            });

            Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => resource.embed('changeLogs', ChangeLogs.toFormResource(domain, instance)))
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
