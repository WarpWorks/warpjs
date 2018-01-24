const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');

module.exports = (domain, entity) => {
    const entityData = {
        domain,
        type: entity.name,
        isDefault: entity.isRootInstance || undefined
    };

    // Clicking on the info icon.
    const typeUrl = RoutesInfo.expand(constants.routes.instance, {
        domain,
        type: ComplexTypes.Entity,
        id: entity.persistenceId
    });

    const resource = warpjsUtils.createResource(typeUrl, entityData);

    resource.link('label', {
        href: resource._links.self.href,
        title: resource._links.self.title
    });

    return resource;
};
