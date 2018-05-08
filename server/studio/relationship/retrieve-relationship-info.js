// const debug = require('debug')('W2:studio:relationship/retrieve-relationship-info');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { profile } = req.query;

    if (profile === constants.routes.PROFILES.types) {
        const resource = warpjsUtils.createResource(req, {
            domain,
            type,
            id,
            relationship,
            profile,
            title: `Relationship ${domain}/${type}/${id}/${relationship} - Types`
        });

        warpjsUtils.wrapWith406(res, {
            [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
                .then(() => warpjsUtils.createResource('', {
                    domain,
                    type: ComplexTypes.Relationship,
                    name: ComplexTypes.Relationship
                }))
                .then((resourceToEmbed) => {
                    resourceToEmbed.link('instances', {
                        href: RoutesInfo.expand(constants.routes.relationship, {
                            domain,
                            type,
                            id,
                            relationship,
                            profile: constants.routes.PROFILES.typeItems
                        }),
                        title: `List of relationships for ${domain}/${type}/${id}`
                    });

                    resource.embed('entities', resourceToEmbed);
                })
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => utils.sendErrorHal(req, res, resource, err))
        });
    } else if (profile === constants.routes.PROFILES.typeItems) {
        const resource = warpjsUtils.createResource(req, {
            domain,
            type,
            id,
            relationship,
            profile,
            title: `Relationship ${domain}/${type}/${id}/${relationship} - Instances`
        });

        warpjsUtils.wrapWith406(res, {
            [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
                .then(() => warpCore.getPersistence())
                .then((persistence) => Promise.resolve()
                    .then(() => warpCore.getDomainByName(domain))
                    .then((domainModel) => domainModel.getElementByPersistenceId(id))
                    .then((pageView) => pageView.getParentEntity())
                    .then((entityModel) => {
                        // FIXME: Hard-coded
                        switch (relationship) {
                            case 'basicProperty':
                                return entityModel.getBasicProperties();

                            case 'relationship':
                                return entityModel.getRelationships();

                            case 'enumeration':
                                return entityModel.getEnums();

                            default:
                                throw new Error(`Unknown relationship='${relationship}'.`);
                        }
                    })
                    .then((elements) => elements.map((element) => warpjsUtils.createResource('', {
                        id: element.id,
                        type: element.type,
                        name: element.name
                    })))
                    .then((entities) => resource.embed('entities', entities))
                    .finally(() => persistence.close())
                )
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => utils.sendErrorHal(req, res, resource, err))
        });
    } else {
        const resource = warpjsUtils.createResource(req, {
            domain,
            type,
            id,
            relationship,
            profile,
            title: `Relationship ${domain}/${type}/${id}/${relationship} - Unknown profile`
        });

        utils.sendErrorHal(req, res, resource, new Error(`TODO: Implement profile=${profile}`));
    }
};
