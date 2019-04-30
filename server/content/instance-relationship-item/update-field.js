// const debug = require('./debug')('update-field');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = async (req, res) => {
    const { domain, type, id, relationship, itemId } = req.params;
    const { body } = req;

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const instance = await entity.getInstance(persistence, id);
        const relationshipEntity = entity.getRelationshipByName(relationship);
        const refs = relationshipEntity.getTargetReferences(instance);
        const item = refs.find((ref) => ref._id === itemId);
        if (item) {
            // TODO: History
            item[body.field] = body.value;
            await entity.updateDocument(persistence, instance, true);
        }
        res.status(204).send();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Update relationship item ERROR: body=", body, "; err=", err);
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
