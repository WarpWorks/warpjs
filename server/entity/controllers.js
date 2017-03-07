const debug = require('debug')('I3CPortal:entity:controllers');
const Promise = require('bluebird');
const hs = require('HeadStart');

const config = require('./../config');
const pathInfo = require('./../path-info');
const Persistence = require('./../persistence');
const utils = require('./../utils');

function createObjResource(obj, addSelf) {
    return utils.createResource(
        (addSelf)
            ? pathInfo(pathInfo.ENTITY, 'self', { id: obj.id, type: obj.type })
            : '',
        {
            type: obj.type,
            id: obj.id,
            name: obj.Name || obj.name,
            desc: obj.Desc || obj.desc,
            heading: obj.Heading,
            content: obj.Content,
            label: obj.label,
            position: obj.position
        }
    );
}

function index(req, res) {
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Entity', 'entity')
    });
}

function extractRelationship(resource, persistence, hsEntity, entity) {
    const relationship = hsEntity.getRelationship();
    // debug("extractRelationship(): relationship=", relationship);

    return relationship.getDocuments(persistence, entity)
        .then((references) => {
            const relationshipResource = createObjResource(relationship, true);

            relationshipResource.embed('references',
                references.map((reference) => createObjResource(reference, true))
            );

            resource.embed('relationships', relationshipResource);
            return relationshipResource;
        });
}

function extractBreadCrumb(responseResource, persistence, entity) {
    debug("extractBreadCrumb(): entity=", entity.type, entity.id);

    return Promise.resolve()
        .then(() => {
            if (entity.parentBaseClassName) {
                return persistence.findOne(entity.parentBaseClassName, {_id: entity.parentID}, true)
                    .then((parentEntity) => extractBreadCrumb(responseResource, persistence, parentEntity));
            }
        })
        .then(() => {
            const resource = createObjResource(entity, true);
            responseResource.embed('breadcrumbs', resource);
        });
}

function extractPageViews(responseResource, persistence, hsEntity, entity) {
    return Promise.resolve(hsEntity.getPageViews(true))
        .then((pageViews) => pageViews[0])
        .then((pageView) => pageView.panels)
        .then((panels) => {
            const embeddedPanels = [];
            return Promise.map(panels,
                (panel) => {
                    const panelResource = createObjResource(panel);
                    embeddedPanels.push(panelResource);

                    const items = [];

                    return Promise.resolve()
                        .then(() => {
                            return Promise.map(panel.separatorPanelItems,
                                (item) => createObjResource(item)
                            );
                        })
                        .then((separators) => {
                            items.push.apply(items, separators);
                        })
                        .then(() => {
                            return Promise.map(panel.relationshipPanelItems,
                                (item) => {
                                    const itemResource = createObjResource(item);
                                    return extractRelationship(itemResource, persistence, item, entity)
                                        .then(() => itemResource);
                                }
                            );
                        })
                        .then((relationships) => {
                            items.push.apply(items, relationships);
                        })
                        .then(() => {
                            panel.basicPropertyPanelItems.forEach((item) => {
                                const itemResource = createObjResource(item);
                                items.push(itemResource);
                            });
                        })
                        .then((basicProperties) => {
                            items.push.apply(items, basicProperties);
                        })
                        .then(() => {
                            items.sort((a, b) => a.position - b.position);
                            panelResource.embed('panelItems', items);
                        });
                }
            )
            .then(() => {
                embeddedPanels.sort((a, b) => a.position - b.position);
                return embeddedPanels;
            });
        })
        .then((panels) => {
            responseResource.embed('panels', panels);
        });
}

function entity(req, res) {
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Entity', 'entity'),

        [utils.HAL_CONTENT_TYPE]: () => {
            const persistence = new Persistence(config.persistence.host, config.domainName);
            Promise.resolve()
                .then(() => hs.getDomainByName(config.domainName))
                .then((domain) => domain.getEntityByName(req.params.type))
                .then((hsEntity) => {
                    hsEntity.getInstance(persistence, req.params.id)
                        .then((entity) => {
                            const responseResource = utils.createResource(req, {
                                Name: entity.Name,
                                Desc: entity.desc,
                                Heading: entity.Heading,
                                Content: entity.Content
                            });

                            Promise.resolve()
                                .then(extractBreadCrumb.bind(null, responseResource, persistence, entity))
                                .then(extractPageViews.bind(null, responseResource, persistence, hsEntity, entity))
                                .then(utils.sendHal.bind(null, req, res, responseResource, null));
                        });
                })
                .finally(() => {
                    persistence.close();
                })
                .catch((err) => {
                    const resource = utils.createResource(req, {
                        message: err.message
                    });

                    utils.sendHal(req, res, resource, 404);
                });
        }
    });
}

module.exports = {
    index,
    entity
};
