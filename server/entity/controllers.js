const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const hs = require('HeadStart');
const path = require('path');
const urlTemplate = require('url-template');

const config = require('./../config');
const pathInfo = require('./../path-info');
const Persistence = require('./../persistence');
const utils = require('./../utils');

// FIXME: Use of BasicProperties instead of this.
const PROPS_TO_PICK = [
    'type',
    'id',
    'name',
    'desc',
    'value',

    // Paragraph
    'Heading',
    'Content',

    // Panel
    'label',
    'position',
    'alternatingColors',

    // Images
    'ImageURL',
    'Caption',
    'AltText',
    'Width',
    'Height',

    // ImageArea
    'Coords',
    'Alt',
    'HRef',
    'Title'
];

function createObjResource(obj, addSelfLink) {
    return utils.createResource(
        (addSelfLink)
            ? pathInfo(pathInfo.ENTITY, 'self', { id: obj.id, type: obj.type })
            : '',
        _.extend(_.pick(obj, PROPS_TO_PICK), {
            name: obj.Name || obj.name,
            desc: obj.Desc || obj.desc
        })
    );
}

function index(req, res) {
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Entity', 'entity')
    });
}

function extractRelationship(resource, persistence, hsEntity, entity) {
    const relationship = hsEntity.getRelationship();
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
    return Promise.resolve()
        .then(() => {
            if (entity.parentBaseClassName) {
                return persistence.findOne(entity.parentBaseClassName, {_id: entity.parentID}, true)
                    .then((parentEntity) => extractBreadCrumb(responseResource, persistence, parentEntity));
            }
        })
        .then(() => {
            entity.name = entity.name || entity.type;
            const resource = createObjResource(entity, true);
            responseResource.embed('breadcrumbs', resource);
        });
}

// FIXME: For debug only.
const RANDOM_IMAGE = urlTemplate.parse('http://lorempixel.com/{Width}/{Height}/{ImageURL}/');
const IMAGE_PATH = urlTemplate.parse('/public/iic_images/{ImageURL}');

function imagePath(req, image) {
    const filePath = path.join(req.app.get('public-folder'), 'iic_images', image.ImageURL);
    try {
        const stats = fs.lstatSync(filePath);
        if (stats.isFile()) {
            image.ImageURL = IMAGE_PATH.expand(image);
        } else if (!/^(http|\?)/.test(image.ImageURL)) {
            image.ImageURL = image.ImageURL.replace(/\W/g, '');
            image.ImageURL = RANDOM_IMAGE.expand(image);
        }
    } catch (e) {
        image.ImageURL = image.ImageURL.replace(/\W/g, '');
        image.ImageURL = RANDOM_IMAGE.expand(image);
    }
}

function entityResource(req, persistence, hsEntity, instance) {
    const resource = createObjResource(instance, true);

    if (instance.type === 'ImageArea') {
        const targets = instance.Target;

        if (targets.length) {
            resource.link('target', {
                title: targets[0].label,
                href: pathInfo(pathInfo.ENTITY, 'self', {id: targets[0].id, type: targets[0].type})
            });
        } else {
            resource.link('target', {
                title: instance.Title,
                href: instance.HRef || '/???'
            });
        }
        delete resource.Target;
    }

    const relationships = [];

    return Promise.each(hsEntity.getRelationships(/*true*/),
            (relationship) => {
                const p = relationship.getDocuments(persistence, instance);
                relationships.push({
                    name: relationship.name,
                    targetEntity: relationship.getTargetEntity(),
                    p
                });
                return p;
            }
        )
        .then(() => {
            return Promise.each(relationships,
                (relationship) => {
                    const images = relationship.p.value();
                    return Promise.each(images,
                        (image) => {
                            // FIXME: This should not be kept for prod.
                            if (image.type === 'Image') {
                                imagePath(req, image);
                            }

                            return entityResource(req, persistence, relationship.targetEntity, image)
                                .then((imageAreaResource) => {
                                    if (imageAreaResource.type === 'ImageArea') {
                                        imageAreaResource.Shape = imageAreaResource.Shape || 'rect';
                                    }
                                    resource.embed(relationship.name, imageAreaResource);
                                });
                        });
                });
        })
        .then(() => resource);
}

function resourcesByRelationship(req, persistence, instance, relationship) {
    return Promise.resolve()
        .then(() => relationship.getDocuments(persistence, instance))
        .then((docs) => docs[0])
        .then((doc) => {
            if (doc) {
                return entityResource(req, persistence, relationship.getTargetEntity(), doc);
            }
        });
}

function createOverviewPanel(req, persistence, hsCurrentEntity, currentInstance) {
    return Promise.resolve()
        // Find the overview.
        .then(() => hsCurrentEntity.getRelationships())
        .then((rels) => rels.find((rel) => rel.name === 'Overview'))
        .then(resourcesByRelationship.bind(null, req, persistence, currentInstance))
        ;
}

function extractPageViews(req, responseResource, persistence, hsEntity, entity) {
    return Promise.resolve(hsEntity.getPageViews(true))
        .then((pageViews) => pageViews.find((pv) => pv.name === 'PortalView') || pageViews[0])
        .then((pageView) => pageView.panels)
        .then((panels) => {
            const embeddedPanels = [];
            return Promise.map(panels,
                (panel, panelIndex) => {
                    const panelResource = createObjResource(panel);
                    embeddedPanels.push(panelResource);

                    const items = [];

                    return Promise.resolve()
                        .then(() => {
                            return Promise.map(panel.separatorPanelItems,
                                (item) => {
                                    items.push(createObjResource(item));
                                });
                        })
                        .then(() => {
                            return Promise.map(panel.relationshipPanelItems,
                                (item) => {
                                    const itemResource = createObjResource(item);
                                    items.push(itemResource);
                                    return extractRelationship(itemResource, persistence, item, entity);
                                }
                            );
                        })
                        .then(() => {
                            return panel.basicPropertyPanelItems.forEach((item) => {
                                item.value = entity[item.name];
                                const itemResource = createObjResource(item);
                                items.push(itemResource);
                            });
                        })
                        .then(() => {
                            return panel.enumPanelItems.forEach((item) => {
                                // TODO
                            });
                        })
                        .then(() => {
                            items.sort((a, b) => a.position - b.position);
                            panelResource.embed('panelItems', items);
                        });
                }
            )
            .then(() => createOverviewPanel(req, persistence, hsEntity, entity))
            .then((overviewPanel) => {
                if (overviewPanel) {
                    // We increment the position becase we will add the overview at
                    // the first position of the panels.
                    embeddedPanels.forEach((panel) => {
                        panel.position = panel.position + 1;
                    });
                    overviewPanel.position = 0;
                    embeddedPanels.unshift(overviewPanel);
                    embeddedPanels.sort((a, b) => a.position - b.position);
                }
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
                    return hsEntity.getInstance(persistence, req.params.id)
                        .then((instance) => {
                            const responseResource = utils.createResource(req, {
                                Name: instance.Name,
                                Desc: instance.desc,
                                Heading: instance.Heading,
                                Content: instance.Content
                            });

                            return Promise.resolve()
                                .then(extractBreadCrumb.bind(null, responseResource, persistence, instance))
                                .then(extractPageViews.bind(null, req, responseResource, persistence, hsEntity, instance))
                                .then(utils.sendHal.bind(null, req, res, responseResource, null));
                        });
                })
                .finally(() => {
                    persistence.close();
                })
                .catch((err) => {
                    let message;
                    let statusCode;

                    console.error("entity():", err);

                    if (err instanceof Persistence.PersistenceError) {
                        message = "Unable to find content.";
                        statusCode = 404;
                    } else {
                        message = "Error during processing content.";
                        statusCode = 500;
                    }

                    const resource = utils.createResource(req, {
                        message
                    });
                    utils.sendHal(req, res, resource, statusCode);
                });
        }
    });
}

module.exports = {
    index,
    entity
};
