const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const studioConstants = require('./../../studio/constants');

module.exports = (domain, entity) => {
    const entityData = {
        domain,
        type: entity.name,
        isDefault: entity.isRootInstance || undefined
    };

    // Clicking on the info icon.
    const typeUrl = RoutesInfo.expand(constants.routes.entity, entityData);
    const resource = warpjsUtils.createResource(typeUrl, entityData);

    // Clicking on the list icon.
    resource.link('instances', {
        href: RoutesInfo.expand(constants.routes.instances, entityData),
        title: `List of instances for ${entity.name}`
    });

    // Clicking on the pencil.
    // TODO: Only link if has admin privileges.
    resource.link('studio', {
        href: RoutesInfo.expand(studioConstants.routes.entity, {domain, type: entity.name}),
        title: "Edit in Studio"
    });

    // Clicking on the name of the domain.
    resource.link('label', {
        href: resource._links.instances.href,
        title: resource._links.instances.title
    });

    return resource;
};
