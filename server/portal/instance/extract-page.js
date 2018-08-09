const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/extract-page');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const breadcrumbsByEntity = require('./../resources/breadcrumbs-by-entity');
const contentConstants = require('./../../content/constants');
const extractPageView = require('./extract-page-view');
const headerImageByEntity = require('./../resources/header-image-by-entity');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();
const statusConfig = config.status;

function computeDocumentStatus(persistence, entity, instance) {
    // debug(`computeDocumentStatus()...`);
    const instanceStatus = instance[statusConfig.property];

    return Promise.resolve()
        .then(() => (instanceStatus === statusConfig.inheritance)
            ? computeParentDocumentStatus(persistence, entity, instance)
            : instanceStatus
        )
        .then((currentOrParentStatus) => currentOrParentStatus || instanceStatus)
    ;
}

function computeParentDocumentStatus(persistence, entity, instance) {
    // debug(`computeParentDocumentStatus()...`);
    return Promise.resolve()
        // .then(() => debug(`computeParentDocumentStatus(): entity=`, entity.constructor.name))
        .then(() => entity.getParentInstance(persistence, instance))
        .then((parentInstances) => parentInstances.pop())
        .then((parentInstance) => (parentInstance)
            ? Promise.resolve()
                .then(() => entity.getParentEntity(instance))
                .then((parentEntity) => computeDocumentStatus(persistence, parentEntity, parentInstance))
            : null
        )
    ;
}

module.exports = (req, persistence, entity, instance) => Promise.resolve()
    .then(() => warpjsUtils.createResource(req, {
        id: instance.id,
        typeId: entity.id,
        typeName: entity.name,
        typeLabel: entity.label || entity.name,
        name: entity.getDisplayName(instance)
    }))
    .then((resource) => Promise.resolve()
        // Breadcrumb
        .then(() => breadcrumbsByEntity(persistence, entity, instance))
        .then((breadcrumbs) => resource.embed('breadcrumbs', breadcrumbs))

        .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
        .then((canEdit) => Promise.resolve()
            .then(() => {
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
                }
            })

            // Document status
            .then(() => computeDocumentStatus(persistence, entity, instance))
            .then((documentStatus) => Promise.resolve()
                .then(() => {
                    resource.status = {
                        documentStatus,
                        isPublic: (_.indexOf(statusConfig.public, documentStatus) !== -1),
                        showDisclaimer: (_.indexOf(statusConfig.disclaimer, documentStatus) !== -1)
                    };

                    resource.status.isVisible = resource.status.isPublic || canEdit;
                })
            )

            // Page content
            .then(() => {
                if (resource.status.isVisible) {
                    return Promise.resolve()
                        .then(() => headerImageByEntity(persistence, entity, instance))
                        .then((headerImages) => resource.embed('headerImages', headerImages))

                        .then(() => entity.getPageView(req.query.view, config.views.portal))
                        .then((pageView) => extractPageView(persistence, pageView, instance, req.query.style))
                        .then((pageViewResource) => resource.embed('pageViews', pageViewResource))
                    ;
                }
            })
        )

        .then(() => resource)
    )
;
