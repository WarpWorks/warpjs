const warpjsUtils = require('@warp-works/warpjs-utils');

const addDocumentToRelationship = require('./add-document-to-relationship');
const ComplexTypes = require('./../../../lib/core/complex-types');
const debug = require('./debug')('update-data');
const serverUtils = require('./../../utils');
const updateDataBasicProperty = require('./update-data-basic-property');
const updateDataRelationship = require('./update-data-relationship');
const deleteDocumentFromRelationship = require('./delete-document-from-relationship');
const utils = require('./../utils');

const IMPLEMENTATIONS = {
    [ComplexTypes.Relationship]: updateDataRelationship,
    [ComplexTypes.BasicProperty]: updateDataBasicProperty
};

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    // debug(`domain=${domain}, type=${type}, id=${id}, body=`, body);

    const resource = warpjsUtils.createResource(req, {
        domain,
        type,
        id,
        body
    });
    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            const persistence = await serverUtils.getPersistence(domain);
            try {
                const entity = await serverUtils.getEntity(domain, type);
                const instance = await entity.getInstance(persistence, id);

                const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);
                if (!canEdit) {
                    throw new warpjsUtils.WarpJSError(`Do not have write permission`);
                }

                if (body && body.action && body.action === 'add') {
                    await addDocumentToRelationship(req, persistence, entity, instance, resource, body);
                } else if (body && body.reference) {
                    const impl = IMPLEMENTATIONS[body.reference.type];
                    if (impl) {
                        if (body.action && body.action === 'delete') {
                            await deleteDocumentFromRelationship(res, req, persistence, entity, instance, body);
                        } else {
                            await impl(persistence, entity, instance, body, req);
                        }
                    } else {
                        debug(`TODO body.reference=`, body.reference);
                    }
                } else {
                    debug(`TODO: no body.reference defined.`);
                }

                await entity.updateDocument(persistence, instance, true);

                await utils.sendHal(req, res, resource);
            } catch (err) {
                await utils.sendErrorHal(req, res, resource, err);
            } finally {
                persistence.close();
            }
        }
    });
};
