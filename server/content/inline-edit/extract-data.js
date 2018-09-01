const debug = require('debug')('W2:content:inline-edit/extract-data');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./constants');
const EntityTypes = require('./../../../lib/core/entity-types');
const listTypes = require('./list-types');
// const overview = require('./resources/overview');
// const pageViewResource = require('./resources/page-view');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { view } = req.query;
    const { body } = req;

    debug(`domain=${domain}, type=${type}, id=${id}, view=${view}, body=`, body);

    // const config = serverUtils.getConfig();
    // const pageViewName = view || config.views.portal;

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
                                                        .then((relationship) => Promise.resolve()
                                                            .then(() => {
                                                                if (relationship.isAggregation && relationship.getTargetEntity().entityType === EntityTypes.DOCUMENT) {
                                                                    debug(`This is not an association nor a paragraph`);
                                                                } else if (!relationship.isAggregation && relationship.getTargetEntity().entityType === EntityTypes.DOCUMENT) {
                                                                    return warpjsUtils.createResource('', {
                                                                        type: relationship.type,
                                                                        id: relationship.id,
                                                                        name: relationship.label || relationship.name,
                                                                        description: relationship.desc,
                                                                        reference: {
                                                                            type: relationship.type,
                                                                            id: relationship.id,
                                                                            name: relationship.name
                                                                        }
                                                                    });
                                                                } else if (relationship.getTargetEntity().name === 'Paragraph') {
                                                                    return Promise.resolve()
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
                                                                    ;
                                                                } else {
                                                                    debug(`TODO: Other?`);
                                                                }
                                                            })

                                                            // .then(() => relationship.getDocuments(persistence, instance))
                                                            // .then((paragraphs) => Promise.map(
                                                            //     paragraphs,
                                                            //     (doc) => Promise.resolve()
                                                            //         .then(() => debug(`doc=`, doc))
                                                            //         .then(() => {
                                                            //         })
                                                            // ))
                                                        )
                                                    ;
                                                } else {
                                                    debug(`TODO: body.reference.type=`, body.reference.type);
                                                }
                                            }
                                        })
                                    ;

                                    //                                        .then(() => [])
                                    //                                        .then((resultItems) => Promise.resolve()
                                    //                                            // Overview
                                    //                                            .then(() => overview(persistence, entity.getRelationshipByName('Overview'), instance))
                                    //                                            .then((items) => resultItems.concat(items))
                                    //                                        )
                                    //
                                    //                                        .then((resultItems) => Promise.resolve()
                                    //                                            .then(() => entity.getPageView(pageViewName))
                                    //                                            .then((pageView) => pageViewResource(persistence, pageView, instance))
                                    //                                            .then((items) => resultItems.concat(items))
                                    //                                        )
                                    //
                                    //                                        .then((items) => instanceResource.embed('items', items))
                                    //                                    ;
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
