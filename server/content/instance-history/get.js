const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    res.format({
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence(domain);

            const resource = warpjsUtils.createResource(req, {
                title: `WarpJS Content: History of '${domain}/${type}/${id}`,
                domain,
                type,
                id
            });

            Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => ChangeLogs.toFormResource(
                        instance,
                        domain,
                        persistence,
                        routes.instance,
                        entity.getDomain().getEntityByName('User') // FIXME: Hard-coded
                    ))
                )
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
