// const debug = require('debug')('W2:portal:resources/breadcrumbs-by-entity');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => entity.getInstancePath(persistence, instance))
    .then((breadcrumbs) => Promise.map(
        breadcrumbs,
        (breadcrumb) => Promise.resolve()
            .then(() => RoutesInfo.expand('entity', {
                type: breadcrumb.type,
                id: breadcrumb.id
            }))
            .then((href) => warpjsUtils.createResource(href, breadcrumb))
    ))
;
