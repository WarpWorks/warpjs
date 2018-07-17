const Promise = require('bluebird');

const createObjResource = require('./create-obj-resource');

module.exports = (responseResource, persistence, hsEntity, instance) => Promise.resolve()
    .then(() => hsEntity.getInstancePath(persistence, instance))
    .then((breadcrumbs) => breadcrumbs.map((breadcrumb) => createObjResource(breadcrumb, true)))
    .then((resources) => responseResource.embed('breadcrumbs', resources))
;
