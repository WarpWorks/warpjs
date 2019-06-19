const ChangeLogs = require('@warp-works/warpjs-change-logs');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;

    res.format({
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            const resource = warpjsUtils.createResource(req, {
                title: `WarpJS Content: History of '${domain}/${type}/${id}`,
                domain,
                type,
                id
            });

            const persistence = serverUtils.getPersistence(domain);

            try {
                const entity = await serverUtils.getEntity(domain, type);
                const instance = await entity.getInstance(persistence, id);
                const changeLogs = await ChangeLogs.toFormResource(
                    instance,
                    domain,
                    persistence,
                    routes.instance,
                    entity.getDomain().getEntityByName('User') // FIXME: Hard-coded
                );

                resource.embed('changeLogs', changeLogs);

                await utils.sendHal(req, res, resource);
            } catch (err) {
                resource.error = true;
                resource.message = err.message;
                await utils.sendHal(req, res, resource, 500);
            } finally {
                persistence.close();
            }
        }
    });
};
