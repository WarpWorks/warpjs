const debug = require('debug')('W2:content:inline-edit/extract-data');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const EntityTypes = require('./../../../lib/core/entity-types');
const overview = require('./resources/overview');
const pageViewResource = require('./resources/page-view');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { view } = req.query;
    const { body } = req;

    debug(`domain=${domain}, type=${type}, id=${id}, view=${view}, body=`, body);

    const config = serverUtils.getConfig();
    const pageViewName = view || config.views.portal;

    const resource = warpjsUtils.createResource(req, {
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
                                    debug(`list types.`);
                                    return Promise.resolve()
                                        .then(() => entity.getRelationshipById(body.reference.id))
                                        .then((childRelationship) => Promise.resolve()
                                            .then(() => childRelationship.getDocuments(persistence, instance))
                                            .then((associations) => associations.sort(warpjsUtils.byName))
                                            .then((associations) => associations.map((association) => warpjsUtils.createResource('', {
                                                type: association.type,
                                                id: association.id,
                                                name: childRelationship.getDisplayName(association),
                                                description: association.relnDesc
                                            })))
                                            .then((associations) => instanceResource.embed('associations', associations))

                                            .then(() => childRelationship.getTargetEntity())
                                            .then((childEntity) => Promise.resolve()
                                                .then(() => childEntity.getChildEntities(true, true))
                                                .then((childEntities) => childEntities.concat(childEntity))
                                                .then((childEntities) => childEntities.filter((childEntity) => !childEntity.isAbstract))
                                                .then((childEntities) => childEntities.filter((childEntity) => childEntity.entityType === EntityTypes.DOCUMENT))
                                                .then((childEntities) => childEntities.sort(warpjsUtils.byName))
                                                .then((childEntities) => childEntities.map((childEntity) => warpjsUtils.createResource('', {
                                                    id: childEntity.id,
                                                    name: childEntity.label || childEntity.name
                                                })))
                                                .then((childEntities) => instanceResource.embed('types', childEntities))
                                                .then(() => {
                                                    if (instanceResource._embedded.types.length === 1) {
                                                        // There was only one type, so let's get the children right away.
                                                        return Promise.resolve()
                                                            .then(() => childEntity.getDocuments(persistence))
                                                            .then((docs) => docs.sort(warpjsUtils.byName))
                                                            .then((docs) => docs.map((doc) => warpjsUtils.createResource('', {
                                                                type: doc.type,
                                                                id: doc.id,
                                                                name: childEntity.getDisplayName(doc)
                                                            })))
                                                            .then((docs) => instanceResource.embed('documents', docs));
                                                    }
                                                })
                                            )
                                        )
                                    ;
                                } else {
                                    return Promise.resolve()
                                        .then(() => [])
                                        .then((resultItems) => Promise.resolve()
                                            // Overview
                                            .then(() => overview(persistence, entity.getRelationshipByName('Overview'), instance))
                                            .then((items) => resultItems.concat(items))
                                        )

                                        .then((resultItems) => Promise.resolve()
                                            .then(() => entity.getPageView(pageViewName))
                                            .then((pageView) => pageViewResource(persistence, pageView, instance))
                                            .then((items) => resultItems.concat(items))
                                        )

                                        .then((items) => instanceResource.embed('items', items))
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
