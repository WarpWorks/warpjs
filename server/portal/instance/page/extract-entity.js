const Promise = require('bluebird');

const extractBreadcrumbs = require('./extract-breadcrumbs');
const extractCommunity = require('./extract-community');
const extractPageView = require('./extract-page-view');
const extractWriteAccess = require('./extract-write-access');

module.exports = (req, responseResource, persistence, hsEntity, instance) => Promise.resolve()
    .then(() => extractBreadcrumbs(responseResource, persistence, hsEntity, instance))
    .then(() => extractPageView(req, responseResource, persistence, hsEntity, instance))
    .then(() => extractWriteAccess(req, responseResource, persistence, hsEntity, instance))
    .then(() => extractCommunity(persistence, hsEntity, instance, 'Authors'))
    .then((authors) => {
        responseResource.embed('authors', authors);
        if (authors.length > 1) {
            responseResource.multiAuthors = true;
        }
    })
    .then(() => extractCommunity(persistence, hsEntity, instance, 'Contributors'))
    .then((contributors) => responseResource.embed('contributors', contributors))
    .then(() => responseResource)
;
