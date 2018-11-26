const ChangeLogs = require('@warp-works/warpjs-change-logs');
const debug = require('debug')('W2:content:inline-edit/extract-data');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./constants');
const imagesByParagraph = require('./../../portal/resources/images-by-paragraph');
const extractDataRelationship = require('./extract-data-relationship');
const listTypes = require('./list-types');
const routesConstants = require('./../constants');
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
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => Promise.resolve()
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
                                        .then(async () => {
                                            if (body && body.reference && body.reference.type) {
                                                if (body.reference.type === ComplexTypes.Relationship) {
                                                    return Promise.resolve()
                                                        .then(() => entity.getRelationshipById(body.reference.id))
                                                        .then((relationship) => relationship.getTargetEntity().name === 'Paragraph'
                                                            ? Promise.resolve()
                                                                .then(() => {
                                                                    resource.body.reference.name = relationship.name;
                                                                })
                                                                .then(() => relationship.getDocuments(persistence, instance))
                                                                .then((paragraphs) => paragraphs.sort(warpjsUtils.byPositionThenName))
                                                                .then((paragraphs) => Promise.map(
                                                                    paragraphs,
                                                                    (paragraph) => Promise.resolve()
                                                                        .then(() => warpjsUtils.createResource('', {
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
                                                                        }))
                                                                        .then((paragraphResource) => Promise.resolve()
                                                                            .then(() => imagesByParagraph(persistence, relationship.getTargetEntity(), paragraph))
                                                                            .then((images) => {
                                                                                if (images && images.length) {
                                                                                    paragraphResource.embed('images', images);
                                                                                }
                                                                            })
                                                                            .then(() => paragraphResource)
                                                                        )

                                                                ))
                                                                .then((paragraphs) => instanceResource.embed('items', paragraphs))
                                                            : Promise.reject(new Error(`Relationship ${relationship.name}'s target is not Paragraph.`))
                                                        )
                                                    ;
                                                } else {
                                                    debug(`TODO: body.reference.type=`, body.reference.type);
                                                }
                                            } else if (body && body.elementType === 'Relationship' && body.elementId) {
                                                const items = await extractDataRelationship(persistence, entity, instance, body);
                                                instanceResource.embed('items', items);
                                            } else if (body && body.elementType === 'BasicProperty' && !body.reference.type) {
                                                const domainModel = entity.getDomain();
                                                const panelElement = domainModel.getElementById(body.elementId);
                                                const basicPropertyElement = domainModel.getElementById(panelElement.basicProperty[0].id);
                                                const basicPropertyValue = basicPropertyElement.getValue(instance);

                                                return Promise.resolve()
                                                    .then(() => warpjsUtils.createResource(req, {
                                                        id: basicPropertyElement.id,
                                                        name: basicPropertyElement.name,
                                                        value: basicPropertyValue
                                                    }))
                                                    .then((basicPropertyResource) => instanceResource.embed('basicProperties', basicPropertyResource))
                                                ;
                                            } else {
                                                debug(`TODO: Handle body=`, body);
                                            }
                                        })
                                    ;
                                }
                            })

                        )
                        // Changelogs
                        .then(() => ChangeLogs.toFormResource(
                            instance,
                            domain,
                            persistence,
                            constants.routes.instance,
                            entity.getDomain().getEntityByName('User') // FIXME: Hard-coded
                        ))
                        .then((changeLogs) => resource.embed('changeLogs', changeLogs))
                    )
                )
                .then(() => resource.link('types', RoutesInfo.expand(routesConstants.routes.entities, {
                    domain,
                    profile: 'linkable'
                })))
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => utils.sendErrorHal(req, res, resource, err))
    });
};
