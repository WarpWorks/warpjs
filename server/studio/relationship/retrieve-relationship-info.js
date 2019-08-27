const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
// const debug = require('./debug')('retrieve-relationship-info');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = async (req, res) => {
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
            [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
                try {
                    const resourceToEmbed = warpjsUtils.createResource('', {
                        domain,
                        type: ComplexTypes.Relationship,
                        name: ComplexTypes.Relationship
                    });

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

                    await utils.sendHal(req, res, resource);
                } catch (err) {
                    await utils.sendErrorHal(req, res, resource, err);
                }
            }
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
            [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
                const persistence = await warpCore.getPersistence();

                try {
                    const domainModel = await warpCore.getDomainByName(domain);
                    const pageView = await domainModel.getElementByPersistenceId(id);
                    const entityModel = pageView.getParentEntity();

                    let elements;

                    // FIXME: Hard-coded
                    switch (relationship) {
                        case 'basicProperty': {
                            elements = entityModel.getBasicProperties();
                            break;
                        }

                        case 'relationship': {
                            elements = entityModel.getRelationships();
                            break;
                        }

                        case 'enumeration': {
                            elements = entityModel.getEnums();
                            break;
                        }

                        default: {
                            throw new Error(`Unknown relationship='${relationship}'.`);
                        }
                    }

                    const entities = elements.map((element) => warpjsUtils.createResource('', {
                        id: element.id,
                        type: element.type,
                        name: element.label || element.name
                    }));

                    resource.embed('entities', entities);

                    await utils.sendHal(req, res, resource);
                } catch (err) {
                    await utils.sendErrorHal(req, res, resource, err);
                } finally {
                    persistence.close();
                }
            }
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
