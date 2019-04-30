const ChangeLogs = require('@warp-works/warpjs-change-logs');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
// const debug = require('./debug')('delete');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    try {
        logger(req, "Trying to delete", req.body);
        const entity = await serverUtils.getEntity(domain, type);

        let instance;
        try {
            instance = await entity.getInstance(persistence, id);
        } catch (err) {
            serverUtils.documentDoesNotExist(req, res);
            return;
        }

        const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);
        if (!canEdit) {
            throw new WarpWorksError(`You do not have permission to delete this entry.`);
        }

        const resource = warpjsUtils.createResource(req, {
            domain,
            type,
            id,
            description: `Removing a document.`
        });

        // Add log to parent document
        const parentData = await entity.getParentData(persistence, instance);
        if (parentData) {
            await ChangeLogs.add(ChangeLogs.ACTIONS.AGGREGATION_REMOVED, req.warpjsUser, parentData.instance, {
                key: instance.parentRelnName,
                label: entity.getDisplayName(instance),
                type: instance.type,
                id: instance.id
            });

            await parentData.entity.updateDocument(persistence, parentData.instance, true);

            resource.link('redirect', {
                title: "Parent document",
                href: RoutesInfo.expand(constants.routes.instance, {
                    domain,
                    type: parentData.instance.type,
                    id: parentData.instance.id
                })
            });
        }

        await entity.removeDocument(persistence, id);

        logger(req, "Deleted", instance);
        // res.status(204).send();
        serverUtils.sendHal(req, res, resource);
    } catch (err) {
        logger(req, "Failed", { err });
        serverUtils.sendError(req, res, err);
    } finally {
        persistence.close();
    }
};
