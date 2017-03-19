const _ = require('lodash');
const debug = require('debug')('HS:extractPageView');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const urlTemplate = require('url-template');

const createObjResource = require('./create-obj-resource');

// FIXME: For debug only.
const RANDOM_IMAGE = urlTemplate.parse('http://lorempixel.com/{Width}/{Height}/{ImageURL}/');
const IMAGE_PATH = urlTemplate.parse('/public/iic_images/{ImageURL}');

function extractRelationship(req, resource, persistence, hsEntity, entity) {
    const relationship = hsEntity.getRelationship();

    return Promise.resolve()
        .then(() => relationship.getDocuments(persistence, entity))
        .then((references) => {
            return Promise.map(references, (reference) => {
                const referenceResource = createObjResource(reference, true);
                if (hsEntity.style === 'Preview') {
                    const referenceEntity = hsEntity.getRelationship().getTargetEntity();
                    return referenceEntity.getOverview(persistence, reference)
                        .then((overviews) => {
                            if (overviews && overviews.length) {
                                return overviews[0];
                            }
                            return [];
                        })
                        .then(convertToResource.bind(null, req))
                        .then((overview) => {
                            if (!_.isArray(overview)) {
                                referenceResource.embed('overview', overview);
                            }
                            return referenceResource;
                        })
                        .catch((err) => {
                            // The entity does not offer a relationship named
                            // 'Overview'?
                            debug(`Could not find overview for: reference=`, reference);
                            debug(`Could not find overview for: referenceEntity=`, referenceEntity);
                            debug(`Could not find overview: Error=`, err);
                            return referenceResource;
                        });
                }
                return referenceResource;
            });
        })
        .then((references) => {
            const relationshipResource = createObjResource(relationship, true);
            relationshipResource.embed('references', references);
            resource.embed('relationships', relationshipResource);
            return relationshipResource;
        });
}

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

function convertToResource(req, data) {
    if (!data) {
        return null;
    }

    if (_.isArray(data)) {
        return data.map(convertToResource.bind(null, req));
    }

    if (data.type === 'Image') {
        imagePath(req, data);
    }

    const basicProperties = _.reduce(
        data,
        (memo, value, key) => {
            if (!_.isArray(value)) {
                return _.extend(memo, {
                    [key]: value
                });
            }
            return memo;
        },
        {}
    );

    const resource = createObjResource(basicProperties, true);

    _.forEach(data, (value, key) => {
        if (_.isArray(value)) {
            resource.embed(key, value.map(convertToResource.bind(null, req)));
        }
    });

    if (resource.type === 'ImageArea') {
        if (resource.HRef) {
            resource.link('target', resource.HRef);
        } else if (resource._embedded && resource._embedded.Targets && resource._embedded.Targets.length) {
            resource.link('target', resource._embedded.Targets[0]._links.self.href);
        }
    }

    return resource;
}

function createOverviewPanel(req, persistence, hsCurrentEntity, currentInstance) {
    return Promise.resolve()
        // Find the overview.
        .then(() => hsCurrentEntity.getOverview(persistence, currentInstance))
        .then(convertToResource.bind(null, req))
        .then((overviews) => {
            const resource = createObjResource({
                alternatingColors: false,
                type: 'Overview'
            });
            resource.embed('overviews', overviews);
            return resource;
        });
}

function addSeparatorPanelItems(panel, items) {
    panel.separatorPanelItems.forEach((item) => {
        items.push(createObjResource(item));
    });
    return items;
}

function addRelationshipPanelItems(req, panel, persistence, entity, items) {
    return Promise.map(
        panel.relationshipPanelItems,
        (item) => {
            const itemResource = createObjResource(item);
            items.push(itemResource);
            return extractRelationship(req, itemResource, persistence, item, entity);
        }
    ).then(() => items);
}

function addBasicPropertyPanelItems(panel, entity, items) {
    panel.basicPropertyPanelItems.forEach((item) => {
        item.value = entity[item.name];
        const itemResource = createObjResource(item);
        items.push(itemResource);
    });
    return items;
}

function addEnumPanelItems(panel, items) {
    panel.enumPanelItems.forEach((item) => {
        // TODO
        debug(`In panel.enumPanelItems...`);
    });
    return items;
}

function sortItems(items) {
    items.sort((a, b) => a.position - b.position);
    return items;
}

function embed(resource, key, items) {
    resource.embed(key, items);
    return resource;
}

module.exports = (req, responseResource, persistence, hsEntity, entity) => {
    return Promise.resolve(hsEntity.getPageView('DefaultPortalView'))
        .then((pageView) => pageView.getPanels())
        .then((panels) => {
            const embeddedPanels = [];
            return Promise.map(panels,
                (panel, panelIndex) => {
                    const panelResource = createObjResource(panel);
                    embeddedPanels.push(panelResource);

                    return Promise.resolve([])
                        .then(addSeparatorPanelItems.bind(null, panel))
                        .then(addRelationshipPanelItems.bind(null, req, panel, persistence, entity))
                        .then(addBasicPropertyPanelItems.bind(null, panel, entity))
                        .then(addEnumPanelItems.bind(null, panel))
                        .then(sortItems)
                        .then(embed.bind(null, panelResource, 'panelItems'));
                }
            )
            .then(() => createOverviewPanel(req, persistence, hsEntity, entity))
            .then((overviewPanel) => {
                if (overviewPanel) {
                    // We increment the position becase we will add the overview at
                    // the first position of the panels.
                    embeddedPanels.forEach((panel) => {
                        // It is some time a Number, some time a String.
                        panel.position = Number(panel.position) + 1;
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
};
