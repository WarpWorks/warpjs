const debug = require('debug')('W2:content:inline-edit/extract-data');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./constants');
const extractDataRelationship = require('./extract-data-relationship');
const listTypes = require('./list-types');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { view } = req.query;
    const { body } = req;

    debug(`domain=${domain}, type=${type}, id=${id}, view=${view}, body=`, body);

    const resource = warpjsUtils.createResource(req, {
        domain,
        type,
        id,
        view,
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
                        .then(() => warpjsUtils.createResource(req, {
                            id: instance.id,
                            type: instance.type,
                            typeID: instance.typeID,
                            name: instance.Name
                        }))
                        .then((instanceResource) => Promise.resolve()
                            .then(() => resource.embed('instances', instanceResource))

                            .then(() => {
                                if (body.action === constants.ACTIONS.LIST_TYPES) {
                                    return Promise.resolve()
                                        .then(() => listTypes(persistence, entity, instance, body, instanceResource))
                                    ;
                                } else {
                                    return Promise.resolve()
                                        .then(() => {
                                            if (body && body.reference && body.reference.type) {
                                                if (body.reference.type === ComplexTypes.Relationship) {
                                                    return Promise.resolve()
                                                        .then(() => entity.getRelationshipById(body.reference.id))
                                                        .then((relationship) => relationship.getTargetEntity().name === 'Paragraph'
                                                            ? Promise.resolve()
                                                                .then(() => relationship.getDocuments(persistence, instance))
                                                                .then((paragraphs) => paragraphs.sort(warpjsUtils.byPositionThenName))
                                                                .then((paragraphs) => Promise.map(
                                                                    paragraphs,
                                                                    (paragraph) => warpjsUtils.createResource('', {
                                                                        type: paragraph.type,
                                                                        id: paragraph.id || paragraph._id,
                                                                        level: paragraph.HeadingLevel || 'H1',
                                                                        isOfHeadingLevel: constants.isOfHeadingLevel(paragraph.HeadingLevel || 'H1'),
                                                                        name: paragraph.Heading,
                                                                        description: paragraph.Content,
                                                                        reference: {
                                                                            type: relationship.type,
                                                                            id: relationship.id,
                                                                            name: relationship.name
                                                                        }
                                                                    })
                                                                ))
                                                                .then((paragraphs) => instanceResource.embed('items', paragraphs))
                                                            : Promise.reject(new Error(`Relationship ${relationship.name}'s target is not Paragraph.`))
                                                        )
                                                    ;
                                                } else {
                                                    debug(`TODO: body.reference.type=`, body.reference.type);
                                                }
                                            } else if (body && body.elementType === 'Relationship') {
                                                return Promise.resolve()
                                                    .then(() => extractDataRelationship(persistence, entity, instance, body))
                                                    .then((items) => instanceResource.embed('items', items))
                                                ;
                                            }
                                        })
                                    ;
                                }
                            })

                        )

                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => utils.sendErrorHal(req, res, resource, err))
    });
};
