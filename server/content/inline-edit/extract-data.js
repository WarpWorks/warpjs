const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./constants');
const debug = require('./debug')('extract-data');
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
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            const persistence = serverUtils.getPersistence(domain);

            try {
                const entity = await serverUtils.getEntity(domain, type);

                const aggregations = entity.getRelationships()
                    .filter((reln) => reln.isAggregation)
                    .filter((reln) => reln.getTargetEntity().isDocument())
                    .map((reln) => warpjsUtils.createResource('', {
                        type: reln.type,
                        id: reln.id,
                        name: reln.name,
                        label: reln.label || reln.name
                    }))
                ;
                resource.embed('aggregations', aggregations);

                const instance = await entity.getInstance(persistence, id);
                const instanceResource = warpjsUtils.createResource(req, {
                    id: instance.id,
                    type: instance.type,
                    typeID: instance.typeID,
                    name: instance.Name
                });

                resource.embed('instances', instanceResource);

                if (body.action === constants.ACTIONS.LIST_TYPES) {
                    return await listTypes(persistence, entity, instance, body, instanceResource);
                } else {
                    if (body && body.reference && body.reference.type) {
                        if (body.reference.type === ComplexTypes.Relationship) {
                            const relationship = entity.getRelationshipById(body.reference.id);

                            if (relationship.getTargetEntity().name === 'Paragraph') {
                                resource.body.reference.name = relationship.name;
                                const paragraphs = await relationship.getDocuments(persistence, instance);
                                paragraphs.sort(warpjsUtils.byPositionThenName);

                                const paragraphResources = await Promise.map(paragraphs, async (paragraph) => {
                                    const paragraphResource = warpjsUtils.createResource('', {
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
                                    });

                                    const images = await imagesByParagraph(persistence, relationship.getTargetEntity(), paragraph);
                                    if (images && images.length) {
                                        paragraphResource.embed('images', images);
                                    }
                                    return paragraphResource;
                                });
                                instanceResource.embed('items', paragraphResources);
                            } else {
                                throw new Error(`Relationship ${relationship.name}'s target is not Paragraph.`);
                            }
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

                        const basicPropertyResource = warpjsUtils.createResource(req, {
                            id: basicPropertyElement.id,
                            name: basicPropertyElement.name,
                            value: basicPropertyValue
                        });
                        instanceResource.embed('basicProperties', basicPropertyResource);
                    } else {
                        debug(`TODO: Handle body=`, body);
                    }
                }

                // Changelogs
                const changeLogs = await ChangeLogs.toFormResource(
                    instance,
                    domain,
                    persistence,
                    constants.routes.instance,
                    entity.getDomain().getEntityByName('User') // FIXME: Hard-coded
                );
                resource.embed('changeLogs', changeLogs);

                resource.link('types', RoutesInfo.expand(routesConstants.routes.entities, {
                    domain,
                    profile: 'linkable'
                }));

                utils.sendHal(req, res, resource);
            } catch (err) {
                utils.sendErrorHal(req, res, resource, err);
            } finally {
                persistence.close();
            }
        }
    });
};
