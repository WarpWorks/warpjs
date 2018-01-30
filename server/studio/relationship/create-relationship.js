// const debug = require('debug')('W2:studio:create-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const DocLevel = require('./../../../lib/doc-level');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        title: `New child for relationship ${domain} - ${type} - ${id} - ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    let domainEntity;

    return Promise.resolve()
        // TODO: Add logger
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => warpCore.getDomainByName(domain))
            .then((de) => {
                domainEntity = de;
            })

            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => Promise.resolve()
                .then(() => {
                    if (!instanceData || !instanceData.entity || !instanceData.instance) {
                        throw new Error(`Unable to find '${type}/${id}'.`);
                    }
                })

                .then(() => {
                    if (body.id && body.type && body.docLevel) {
                        // Association
                        return Promise.resolve()
                            .then(() => DocLevel.fromString(body.docLevel))
                            .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
                            .then((docLevelData) => docLevelData.model.addValue(persistence, body.type, body.id, docLevelData.instance))
                            .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
                            .then(() => {
                                // TODO: logger
                            })
                        ;
                    } else if (body.docLevel) {
                        // Embedded!
                        return Promise.resolve()
                            .then(() => DocLevel.fromString(body.docLevel))
                            .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
                            .then((docLevelData) => Promise.resolve()
                                .then(() => docLevelData.model.getTargetReferences(docLevelData.instance))
                                .then((references) => {
                                    const newInstance = docLevelData.model.getTargetEntity().newInstance(null, domainEntity.createNewID());
                                    references.push(newInstance);
                                    return newInstance;
                                })
                            )
                            .then((newInstance) => {
                                // TODO: ChangeLog
                            })
                            .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
                            .then(() => {
                                // TODO: logger
                            })
                        ;
                    } else {
                        // Aggregation
                        return Promise.resolve()
                            .then(() => instanceData.entity.getRelationshipByName(relationship))
                            .then((relationshipModel) => Promise.resolve()
                                .then(() => instanceData.entity.createChildForInstance(instanceData.instance, relationshipModel, domainEntity.createNewID()))
                                .then((child) => Promise.resolve()
                                    // TODO: Changelog createEntity()
                                    .then(() => relationshipModel.getTargetEntity())
                                    .then((targetEntity) => Promise.resolve()
                                        .then(() => targetEntity.createDocument(persistence, child))
                                        .then((newDoc) => Promise.resolve()
                                            .then(() => {
                                                // TODO: ChangeLogs.AddAggregation()
                                            })
                                            .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
                                            .then(() => {
                                                const redirectUrl = RoutesInfo.expand(constants.routes.instance, {
                                                    domain,
                                                    type: targetEntity.name,
                                                    id: newDoc.id
                                                });

                                                resource.link('redirect', redirectUrl);
                                            })
                                        )
                                    )
                                )
                            )
                        ;
                    }
                })
            )
            .finally(() => persistence.close())
        )
        .then(() => utils.sendHal(req, res, resource))
        .catch((err) => {
            console.error(`Error creating new relationship child. err=`, err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
