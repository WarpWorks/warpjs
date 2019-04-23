const extend = require('lodash/extend');
const ChangeLogs = require('@warp-works/warpjs-change-logs');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

// const debug = require('./debug')('update-aggregation');

module.exports = async (req, res) => {
    const { domain, type, id, reln } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        domain,
        type,
        id,
        reln,
        desc: "Update paragraph aggregation"
    });

    const persistence = await serverUtils.getPersistence(domain);
    try {
        const entity = await serverUtils.getEntity(domain, type);
        const instance = await entity.getInstance(persistence, id);

        const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);
        if (!canEdit) {
            const err = { message: `Do not have write permission` };
            await warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo, 403);
            return;
        }

        const relationship = entity.getRelationshipById(body.referenceId);

        const documents = await relationship.getDocuments(persistence, instance);
        const documentToModify = documents.find((doc) => doc._id === body.id);
        if (documentToModify) {
            const paragraphEntity = await serverUtils.getEntity(domain, 'Paragraph');
            const subDocumentAggregationBasicProperty = paragraphEntity.getBasicPropertyByName('SubDocuments');
            const changeSet = await subDocumentAggregationBasicProperty.setValue(documentToModify, reln);
            await ChangeLogs.add(
                ChangeLogs.ACTIONS.UPDATE_VALUE,
                req.warpjsUser,
                instance,
                extend({}, changeSet, { key: `Relationship:${relationship.name}.Entity:${body.id}.Basic:${subDocumentAggregationBasicProperty.name}` })
            );
            await entity.updateDocument(persistence, instance);
        }

        await warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        await warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
    } finally {
        persistence.close();
    }
};
