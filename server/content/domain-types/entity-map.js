const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (domain, entity) => {
    const entityData = {
        domain,
        type: entity.name,
        isDefault: entity.isRootInstance || undefined
    };

    const typeUrl = RoutesInfo.expand('W2:content:entity', entityData);
    const resource = warpjsUtils.createResource(typeUrl, entityData);

    resource.link('instances', {
        href: RoutesInfo.expand('W2:content:instances', entityData),
        title: `List of instances for ${entity.name}`
    });

    return resource;
};
