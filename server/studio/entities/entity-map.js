// const debug = require('debug')('W2:studio:entities/entity-map');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
const contentRoutes = require('./../../content/constants').routes;

module.exports = (domain, entity) => {
    const entityData = {
        domain,
        type: entity.name,
        id: entity.id,
        name: entity.name,
        desc: entity.desc,
        isDefault: entity.isRootInstance || undefined,
        isAbstract: entity.isAbstract,
        isRootEntity: entity.isRootEntity,
        isRootInstance: entity.isRootInstance
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

    if (entity.isDocument() && !entity.isAbstract) {
        resource.link('content', {
            href: RoutesInfo.expand(contentRoutes.instances, {
                domain,
                type: entity.name
            }),
            title: `Show instances of '${entity.name}'.`
        });
    }

    return resource;
};
