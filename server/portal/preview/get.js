const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const type = req.params.type;
    const id = req.params.id;

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence();
            const entity = serverUtils.getEntity(null, type);

            Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => {
                    return warpjsUtils.createResource(req, {
                        title: instance.Name,
                        desc: instance.desc,
                        type,
                        id
                    });
                })
                .then((resource) => warpjsUtils.sendHal(req, res, resource, RoutesInfo))
                .catch((err) => serverUtils.sendError(req, res, err))
                .finally(() => persistence.close())
            ;
        }
    });
};
