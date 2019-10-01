const Promise = require('bluebird');

const ChangeLogs = require('@warp-works/warpjs-change-logs');
const warpjsUtils = require('@warp-works/warpjs-utils');

const DOCUMENT_STATUS = require('./../../../lib/constants/document-status');
const Document = require('./../../../lib/core/first-class/document');
const DocumentStatus = require('./../../../lib/core/first-class/document-status');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

// const debug = require('./debug')('update-status');

module.exports = async (req, res) => {
    const { domain, type, id, status } = req.params;

    const resource = warpjsUtils.createResource(req, {
        domain,
        type,
        id,
        status,
        description: `Update status of '${domain}/${type}/${id}' to '${status}'`
    }, req);

    const persistance = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const document = await entity.getInstance(persistance, id);

        const promotions = DocumentStatus.promote(document);
        const indexOf = promotions.indexOf(status);
        if (indexOf === -1) {
            throw new Error(`Invalid promotion status from '${document.Status}' to '${status}'.`);
        }

        const statusEnum = entity.getEnumByName('Status');
        if (!statusEnum) {
            throw new Error(`Invalid entity without 'Status'.`);
        }

        const { oldValue, newValue } = await statusEnum.setValue(document, status);
        ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, document, {
            key: 'Enum:Status',
            oldValue,
            newValue
        });
        await entity.updateDocument(persistance, document);

        if (newValue === DOCUMENT_STATUS.APPROVED) {
            const predecessorRelationship = entity.getRelationshipByName('Predecessor');
            const domainEntity = entity.getDomain();
            if (predecessorRelationship) {
                const predecessors = await predecessorRelationship.recursiveGetDocuments(persistance, document);
                await Promise.each(predecessors, async (predecessor) => {
                    const predecessorEntity = domainEntity.getEntityByInstance(predecessor);
                    const { oldValue, newValue } = await statusEnum.setValue(predecessor, DOCUMENT_STATUS.RETIRED);
                    ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, predecessor, {
                        key: 'Enum:Status',
                        oldValue,
                        newValue
                    });
                    await predecessorEntity.updateDocument(persistance, predecessor);
                });
            }
        }

        resource.status = {
            documentStatus: await Document.computeDocumentStatus(persistance, entity, document),
            promotion: Document.statusPromotion(req, entity, document)
        };

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Update status *** ERROR ***`, err);
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistance.close();
    }
};
