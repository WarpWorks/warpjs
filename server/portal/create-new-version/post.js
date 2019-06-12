const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('post');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        description: `Creating a new version for '${type}/${id}'.`,
        body
    }, req);

    const persistence = await serverUtils.getPersistence();

    try {
        const entity = await serverUtils.getEntity(null, type);
        const instance = await entity.getInstance(persistence, id);

        const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);
        if (canEdit) {
            const clone = await entity.clone(persistence, instance, null, body.nextVersion);

            resource.link('newVersion', {
                href: RoutesInfo.expand(routes.portal.entity, clone),
                title: "Created new version"
            });

            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        } else {
            throw new Error(`Unauthorized to create a new version.`);
        }
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
    } finally {
        await persistence.close();
    }
};
