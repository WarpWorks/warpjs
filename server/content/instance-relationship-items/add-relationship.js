const debug = require('debug')('W2:content:instance-relationship-items/add-relationship');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = async (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    debug(`(): domain=${domain}, type=${type}, id=${id}, relationship=${relationship}`);
    debug(`(): body=`, body);

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const instance = await entity.getInstance(persistence, id);
        const relationshipEntity = entity.getRelationshipByName(relationship);

        if (relationshipEntity.isAggregation) {
            // TODO: This cannot handle creating an aggregation yet.
            throw new Error(`Unexpected aggregation relationship '${relationship}'.`);
        } else if (!relationshipEntity.getTargetEntity().isDocument()) {
            // TODO: This cannot handle creating an embedded yet.
            throw new Error(`Unexpected embedded relationship '${relationship}'.`);
        } else {
            relationshipEntity.addAssociation(instance, body);
        }

        // TODO: Add history
        await entity.updateDocument(persistence, instance);
        res.status(204).send();
    } catch (err) {
        console.error(`add-relationship item ERROR: err=`, err);
        const resource = warpjsUtils.createResource(req, {
            domain,
            type,
            id,
            relationship,
            body,
            message: err.message
        });
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
