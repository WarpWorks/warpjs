const _ = require('lodash');
const debug = require('debug')('W2:portal:extractPageView');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const urlTemplate = require('url-template');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basicTypes = require('./../../../../lib/core/basic-types');
const convertCustomLinks = require('./../convert-custom-links');
const createObjResource = require('./create-obj-resource');
const embed = require('./embed');
const sortItems = require('./sort-items');

const IMAGE_PATH = urlTemplate.parse('/public/iic_images/{ImageURL}'); // FIXME: Hard-coded path.
const CONTENT_LINK_RE = require('./../../../../lib/core/content-link-re');

function parseLinks(overviews) {
    if (overviews) {
        return overviews.map((overview) => {
            if (overview && overview.Content && overview.Content.match(CONTENT_LINK_RE)) {
                const contentBasicProperty = _.filter(overview.basicProperties, (prop) => prop.name === 'Content'); // FIXME: Hard-coded
                overview.containsHTML = contentBasicProperty.length && contentBasicProperty[0].propertyType === basicTypes.Text;
                if (overview.containsHTML) {
                    overview.Content = convertCustomLinks(overview.Content);
                }
            }
            return overview;
        });
    }
    return overviews;
}

function extractRelationship(req, resource, persistence, hsEntity, entity) {
    const relationship = hsEntity.getRelationship();

    return Promise.resolve()
        .then(() => relationship.getDocuments(persistence, entity))
        .then((references) => {
            const onlyExistingReferences = references.filter((reference) => reference.id && reference.type);
            return Promise.map(onlyExistingReferences, (reference) => {
                const referenceResource = createObjResource(reference, true);
                resource.styles = {
                    CSV: (hsEntity.style === 'CSV'),
                    Preview: (hsEntity.style === 'Preview'),
                    Table: (hsEntity.style === 'Table'),
                    Tile: (hsEntity.style === 'Tile')
                };
                if (hsEntity.style === 'Preview') {
                    const referenceEntity = hsEntity.getRelationship().getTargetEntity();
                    return referenceEntity.getOverview(persistence, reference)
                        .then(parseLinks)
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
    const publicFolder = req.app.get('public-folder');
    const publicFolderPath = req.app.get('public-folder-path');

    let filePath;

    if (image && image.ImageURL && image.ImageURL.indexOf(publicFolderPath) === 0) {
        filePath = path.join(publicFolder, image.ImageURL.substring(publicFolderPath.length));
    } else {
        filePath = path.join(publicFolder, 'iic_images', image.ImageURL || '');
        image.ImageURL = IMAGE_PATH.expand(image);
    }

    try {
        const stats = fs.lstatSync(filePath);
        if (!stats.isFile() && !/^(http|\?)/.test(image.ImageURL)) {
            image.ImageURL = '';
        }
    } catch (e) {
        image.ImageURL = '';
    }
}

function customResource(req, key, item) {
    const resource = convertToResource(req, item);
    if (key === 'Target') {
        resource.link('preview', RoutesInfo.expand('W2:portal:preview', {
            type: item.type,
            id: item.id
        }));
    }
    return resource;
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

    let propsToPick = null;
    if (data.basicProperties && data.basicProperties.length) {
        propsToPick = data.basicProperties.reduce((memo, value) => {
            memo.push(value.name);
            return memo;
        }, []);
    }

    const resource = createObjResource(basicProperties, true, propsToPick);

    _.forEach(data, (value, key) => {
        if (_.isArray(value)) {
            resource.embed(key, value.map(customResource.bind(null, req, key)));
        }
    });

    if (resource.type === 'ImageArea') {
        if (resource._embedded && resource._embedded.Targets && resource._embedded.Targets.length) {
            resource.link('target', resource._embedded.Targets[0]._links.self.href);
            resource.link('preview', resource._embedded.Targets[0]._links.preview.href);
        } else if (resource.HRef) {
            resource.link('target', resource.HRef);
        }
    }

    return resource;
}

function createOverviewPanel(req, persistence, hsCurrentEntity, currentInstance) {
    return Promise.resolve()
        // Find the overview.
        .then(() => hsCurrentEntity.getOverview(persistence, currentInstance))
        .then(parseLinks)
        .then(convertToResource.bind(null, req))
        .then((overviews) => overviews ? overviews.sort(warpjsUtils.byPositionThenName) : overviews)
        .then((overviews) => {
            if (overviews) {
                const resource = createObjResource({
                    position: 0,
                    alternatingColors: false,
                    type: 'Overview'
                });

                resource.embed('overviews', overviews);
                return resource;
            }
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
        item.value = item.hasBasicProperty() ? item.getBasicProperty().getValue(entity) : null;

        const itemResource = createObjResource(item);
        itemResource.model = {
            propertyType: item.basicProperty[0].propertyType
        };
        items.push(itemResource);
    });
    return items;
}

function addEnumPanelItems(panel, entity, items) {
    panel.enumPanelItems.forEach((item) => {
        item.value = entity[item.name];
        const itemResource = createObjResource(item);
        items.push(itemResource);
    });
    return items;
}

module.exports = (req, responseResource, persistence, hsEntity, entity) => Promise.resolve()
    .then(() => hsEntity.getPageView('DefaultPortalView'))
    .then((pageView) => pageView.getPanels())
    .then((panels) => {
        const embeddedPanels = [];
        return Promise.resolve()
            .then(() => Promise.map(panels,
                (panel, panelIndex) => {
                    const panelResource = createObjResource(panel);
                    embeddedPanels.push(panelResource);

                    return Promise.resolve()
                        .then(() => [])
                        .then((items) => addSeparatorPanelItems(panel, items))
                        .then((items) => addRelationshipPanelItems(req, panel, persistence, entity, items))
                        .then((items) => addBasicPropertyPanelItems(panel, entity, items))
                        .then((items) => addEnumPanelItems(panel, entity, items))
                        .then((items) => sortItems(items))
                        .then((items) => embed(panelResource, 'panelItems', items));
                }
            ))
            .then(() => createOverviewPanel(req, persistence, hsEntity, entity))
            .then((overviewPanel) => {
                if (overviewPanel) {
                    // We increment the position becase we will add the overview at
                    // the first position of the panels.
                    embeddedPanels.forEach((panel) => {
                        // It is some time a Number, some time a String.
                        panel.position = Number(panel.position) + 1;
                    });
                    embeddedPanels.unshift(overviewPanel);
                    embeddedPanels.sort((a, b) => a.position - b.position);
                }
                return embeddedPanels;
            });
    })
    .then((panels) => responseResource.embed('panels', panels))
;
