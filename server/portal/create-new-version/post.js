const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const debug = require('./debug')('post');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { body } = req;

    debug(`type=${type}; id=${id}; body=`, body);

    const resource = warpjsUtils.createResource(req, {
        description: `Creating a new version for '${type}/${id}'.`,
        body
    }, req);

    const persistence = await serverUtils.getPersistence();

    try {
        const entity = await serverUtils.getEntity(null, type);
        const instance = await entity.getInstance(persistence, id);

        const clone = await entity.clone(persistence, instance, null, body.nextVersion);
        // The clone replace the name of the top parent, so let's put it back.
        clone.Name = instance.Name;
        await entity.updateDocument(persistence, clone);

        debug(`clone=`, clone);
        resource.link('newVersion', {
            href: RoutesInfo.expand(routes.portal.entity, clone),
            title: "Created new version"
        });

        warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
    } finally {
        await persistence.close();
    }
};
