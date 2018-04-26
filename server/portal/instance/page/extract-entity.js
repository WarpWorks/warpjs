// const debug = require('debug')('W2:portal:instance/page/extract-entity');
const Promise = require('bluebird');

const checkStatus = require('./check-status');
const extractBreadcrumbs = require('./extract-breadcrumbs');
const extractCommunity = require('./extract-community');
const extractPageView = require('./extract-page-view');
const extractWriteAccess = require('./extract-write-access');

module.exports = (req, responseResource, persistence, hsEntity, instance) => Promise.resolve()
    .then(() => extractBreadcrumbs(responseResource, persistence, hsEntity, instance))
    .then(() => extractWriteAccess(req, responseResource, persistence, hsEntity, instance))
    .then(() => checkStatus(req, persistence, hsEntity, instance))
    .then((instanceStatus) => {
        responseResource.isVisible = instanceStatus.isVisible;
        responseResource.showDisclaimer = instanceStatus.showDisclaimer;
        responseResource.isPublic = instanceStatus.isPublic;
        responseResource.documentStatus = instanceStatus.documentStatus;

        if (instanceStatus.isVisible) {
            return Promise.resolve()
                .then(() => extractPageView(req, responseResource, persistence, hsEntity, instance))
                .then(() => extractCommunity(persistence, hsEntity, instance, 'Authors'))
                .then((authors) => {
                    responseResource.embed('authors', authors);
                    if (authors.length > 1) {
                        responseResource.multiAuthors = true;
                    }
                })
                .then(() => extractCommunity(persistence, hsEntity, instance, 'Contributors'))
                .then((contributors) => responseResource.embed('contributors', contributors))
            ;
        }
    })
    .then(() => responseResource)
;
