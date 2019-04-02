const indexOf = require('lodash/indexOf');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const breadcrumbsByEntity = require('./../resources/breadcrumbs-by-entity');
const contentConstants = require('./../../content/constants');
// const debug = require('./debug')('extract-page');
const extractPageView = require('./extract-page-view');
const headerImageByEntity = require('./../resources/header-image-by-entity');
const serverUtils = require('./../../utils');
const targetPreviewsByEntity = require('./../resources/target-previews-by-entity');

const config = serverUtils.getConfig();
const statusConfig = config.status;

const computeDocumentStatus = async (persistence, entity, instance) => {
    // debug(`computeDocumentStatus()...`);
    const instanceStatus = instance[statusConfig.property];

    const currentOrParentStatus = (instanceStatus === statusConfig.inheritance)
        ? await computeParentDocumentStatus(persistence, entity, instance)
        : instanceStatus
    ;

    return currentOrParentStatus || instanceStatus;
};

const computeParentDocumentStatus = async (persistence, entity, instance) => {
    // debug(`computeParentDocumentStatus()...`);
    // debug(`computeParentDocumentStatus(): entity=`, entity.constructor.name);
    const parentInstances = await entity.getParentInstance(persistence, instance);
    const parentInstance = parentInstances.pop();
    if (parentInstance) {
        const parentEntity = await entity.getParentEntity(instance);
        await computeDocumentStatus(persistence, parentEntity, parentInstance);
    } else {
        return null;
    }
};

module.exports = async (req, persistence, entity, instance) => {
    const resource = warpjsUtils.createResource(req, {
        id: instance.id,
        typeId: entity.id,
        typeName: entity.name,
        typeLabel: entity.label || entity.name,
        name: entity.getDisplayName(instance),
        isHomePage: req.params.type === config.domainName,
        hasGA: config.analytics && config.analytics.apiKey

    });

    // Breadcrumb
    const breadcrumbs = await breadcrumbsByEntity(persistence, entity, instance);
    resource.embed('breadcrumbs', breadcrumbs);

    const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);

    // WriteAccess
    if (canEdit) {
        resource.link('edit', {
            href: RoutesInfo.expand(contentConstants.routes.instance, {
                domain: config.domainName,
                type: instance.type,
                id: instance.id
            }),
            title: `Edit "${resource.name}"`
        });

        resource.link('inlineEdit', {
            href: RoutesInfo.expand(contentConstants.routes.inlineEdit, {
                domain: config.domainName,
                type: instance.type,
                id: instance.id,
                view: req.query.view
            }),
            title: `In-line edit "${resource.name}"`
        });
    }

    // Document status
    const documentStatus = await computeDocumentStatus(persistence, entity, instance);
    resource.status = {
        documentStatus,
        isPublic: (indexOf(statusConfig.public, documentStatus) !== -1),
        showDisclaimer: (indexOf(statusConfig.disclaimer, documentStatus) !== -1)
    };
    resource.status.isVisible = resource.status.isPublic || canEdit || false;

    // Page content
    if (resource.status.isVisible) {
        const headerImages = await headerImageByEntity(persistence, entity, instance);
        resource.embed('headerImages', headerImages);

        const targetPreviews = await targetPreviewsByEntity(persistence, entity, instance);
        resource.embed('previews', targetPreviews);

        const pageView = await entity.getPageView(req.query.view, config.views.portal);
        const pageViewResource = await extractPageView(persistence, pageView, instance, req.query.style);
        resource.embed('pageViews', pageViewResource);
    }

    return resource;
};
