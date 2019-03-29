/**
 *  Removes a referenced relationship. The use of PATCH is an abuse to work
 *  around some limitations on the DELETE (no payload allowed on some devices).
 */
const logger = require('./../../loggers');
const removeAssociation = require('./remove-association');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);

        let instance;
        try {
            instance = await entity.getInstance(persistence, id);
        } catch (err) {
            await serverUtils.documentDoesNotExist(req, res);
        }

        const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);
        if (!canEdit) {
            throw new WarpWorksError(`You do not have permission to edit this entry.`);
        }

        await removeAssociation(req, res, persistence, entity, instance);
    } catch (err) {
        logger(req, "Failed", { err });
        serverUtils.sendError(req, res, err);
    } finally {
        persistence.close();
    }
};
