const debug = require('debug')('W2:content:inline-edit/update-data');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const addDocumentToRelationship = require('./add-document-to-relationship');
const ComplexTypes = require('./../../../lib/core/complex-types');
const serverUtils = require('./../../utils');
const updateDataBasicProperty = require('./update-data-basic-property');
const updateDataRelationship = require('./update-data-relationship');
const deleteDocumentFromRelationship = require('./delete-document-from-relationship');
const utils = require('./../utils');

const IMPLEMENTATIONS = {
    [ComplexTypes.Relationship]: updateDataRelationship,
    [ComplexTypes.BasicProperty]: updateDataBasicProperty
};

module.exports = (req, res) => {
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
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence(domain))
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => Promise.resolve()
                        .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                        .then((canEdit) => {
                            if (!canEdit) {
                                throw new warpjsUtils.WarpJSError(`Do not have write permission`);
                            }
                        })
                        .then(() => {
                            if (body && body.action && body.action === 'add') {
                                return addDocumentToRelationship(req, persistence, entity, instance, resource, body);
                            } else if (body && body.reference) {
                                const impl = IMPLEMENTATIONS[body.reference.type];
                                if (impl) {
                                    if (body.action && body.action === 'delete') {
                                        return deleteDocumentFromRelationship(res, req, persistence, entity, instance, body);
                                    } else {
                                        return impl(persistence, entity, instance, body);
                                    }
                                } else {
                                    debug(`TODO body.reference=`, body.reference);
                                }
                            } else {
                                debug(`TODO: no body.reference defined.`);
                            }
                        })
                        .then((changes) => {
                            // TODO: Add changelog.
                            debug(`changes=`, changes);
                        })
                        .then(() => entity.updateDocument(persistence, instance))
                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => utils.sendErrorHal(req, res, resource, err))
    });
};
