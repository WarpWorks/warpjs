const Promise = require('bluebird');

const extractBreadcrumbs = require('./extract-breadcrumbs');
const extractPageView = require('./extract-page-view');
const extractWriteAccess = require('./extract-write-access');

module.exports = (req, responseResource, persistence, hsEntity, instance, isPreview) => {
    return Promise.resolve()
        .then(extractBreadcrumbs.bind(null, responseResource, persistence, hsEntity, instance))
        .then(extractPageView.bind(null, req, responseResource, persistence, hsEntity, instance, isPreview))
        .then(extractWriteAccess.bind(null, req, responseResource, persistence, hsEntity, instance));
};
