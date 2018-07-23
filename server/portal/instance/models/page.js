const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/models/page');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const contentConstants = require('./../../../content/constants');
const PageView = require('./page-view');
const serverUtils = require('./../../../utils');

class Page {
    constructor() {
        this.entity = null;
        this.instance = null;
        this.pageView = null;

        this.status = {};
        this.editLink = null;
    }

    extract(persistence, entity, instance, pageViewName, warpjsUser) {
        const config = serverUtils.getConfig();

        return Promise.resolve()
            // .then(() => debug('entity=', entity))
            // .then(() => debug('instance=', instance))
            .then(() => {
                this.instance = instance;
                this.entity = entity;
                this.pageView = new PageView();
            })

            // Breadcrumb

            // WriteAccess
            .then(() => serverUtils.canEdit(persistence, entity, instance, warpjsUser))
            .then((canEdit) => {
                this.editLink = RoutesInfo.expand(contentConstants.routes.instance, {
                    domain: config.domainName,
                    type: instance.type,
                    id: instance.id
                });
            })

            // Document Status
            .then(() => this.computeDocumentStatus(persistence, entity, instance))
            .then((documentStatus) => Promise.resolve()
                .then(() => _.extend(this.status, {
                    documentStatus,
                    isPublic: (_.indexOf(config.status.public, documentStatus) !== -1),
                    showDisclaimer: (_.indexOf(config.status.disclaimer, documentStatus) !== -1)
                }))
                .then(() => this.status.isPublic || serverUtils.canEdit(persistence, entity, instance, warpjsUser))
                .then((isVisible) => _.extend(this.status, { isVisible }))
            )

            .then(() => (this.status.isVisible)
                ? Promise.resolve()
                    .then(() => entity.getPageView(pageViewName))
                    .then((pageViewEntity) => Promise.resolve()
                        .then(() => this.pageView.extract(persistence, pageViewEntity, instance, pageViewName))
                    )
                : null
            )

            .then(() => this)
        ;
    }

    toHal(req) {
        const resource = warpjsUtils.createResource(req, {
            id: this.instance.id,
            typeId: this.entity.id,
            typeName: this.entity.name,
            typeLabel: this.entity.label,
            name: this.entity.getDisplayName(this.instance),
            status: this.status
        });

        resource.embed('pageViews', this.pageView.toHal());

        if (this.editLink) {
            resource.link('edit', {
                href: this.editLink,
                title: `Edit "${resource.name}"`
            });
        }

        return resource;
    }

    computeDocumentStatus(persistence, entity, instance) {
        const config = serverUtils.getConfig();
        const statusConfig = config.status;

        const instanceStatus = instance[statusConfig.property];

        return Promise.resolve()
            .then(() => (instanceStatus === statusConfig.inheritance)
                ? this.computeParentDocumentStatus(persistence, entity, instance)
                : instanceStatus
            )
        ;
    }

    computeParentDocumentStatus(persistence, entity, instance) {
        return Promise.resolve()
            .then(() => entity.getParentInstance(persistence, instance))
            .then((parentInstances) => parentInstances.pop())
            .then((parentInstance) => (parentInstance)
                ? this.computeDocumentStatus(persistence, entity.getParentEntity(instance), parentInstance)
                : null
            )
        ;
    }
}

module.exports = Page;
