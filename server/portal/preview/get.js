const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const convertCustomLinks = require('./../instance/convert-custom-links');
const serverUtils = require('./../../utils');
const walkExtract = require('./../instance/page/walk-extract');

module.exports = (req, res) => {
    const type = req.params.type;
    const id = req.params.id;

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence();
            const entity = serverUtils.getEntity(null, type);
            const config = serverUtils.getConfig();

            Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => Promise.resolve()
                    .then(() => walkExtract(persistence, entity, instance, [], config.previews.overviewPath))
                    .then((overviews) => (overviews.length && overviews[0]) || null)
                    .then((overview) => warpjsUtils.createResource(req, {
                        title: instance.Name,
                        desc: instance.desc,
                        content: convertCustomLinks(overview && overview.Content), // FIXME: Hard-coded attribute.
                        type,
                        id
                    }))
                )
                .then((resource) => warpjsUtils.sendHal(req, res, resource, RoutesInfo))
                .catch((err) => serverUtils.sendError(req, res, err))
                .finally(() => persistence.close())
            ;
        }
    });
};
