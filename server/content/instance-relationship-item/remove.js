const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = async (req, res) => {
    const { domain, type, id, relationship, itemId } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const instance = await entity.getInstance(persistence, id);
        const relationshipEntity = entity.getRelationshipByName(relationship);

        const refs = relationshipEntity.getTargetReferences(instance);

        const indexOf = refs.findIndex((ref) => ref._id === itemId);
        if (indexOf !== -1) {
            refs.splice(indexOf, 1);
            // FIXME: Add history.
            await entity.updateDocument(persistence, instance);
        }

        res.status(204).send();
    } catch (err) {
        console.error("remove relationship item ERROR: err=", err);
        const resource = warpjsUtils.createResource(req, {
            domain,
            type,
            id,
            relationship,
            itemId,
            message: err.message
        });
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
