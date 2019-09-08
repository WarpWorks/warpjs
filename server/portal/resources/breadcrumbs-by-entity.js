const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');

// const debug = require('./debug')('breadcrumbs-by-entity');

module.exports = async (persistence, entity, instance) => {
    const breadcrumbs = await entity.getInstancePath(persistence, instance);

    const domain = entity.getDomain();

    return Promise.map(
        breadcrumbs,
        async (breadcrumb) => {
            try {
                const entity = domain.getEntityByInstance(breadcrumb);
                const document = await entity.getInstance(persistence, breadcrumb.id);

                const href = await Document.getPortalUrl(persistence, entity, document);
                return warpjsUtils.createResource(href, breadcrumb);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(`*** Breadcrumb error for breadcrumb=`, breadcrumb);
                // eslint-disable-next-line no-console
                console.error(`*** ERROR ***:`, err);
                return null;
            }
        }
    );
};
