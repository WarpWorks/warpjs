// const debug = require('debug')('W2:studio:relationship/create-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const DocLevel = require('./../../../lib/doc-level');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

// function handleTargetEntity(req, res, persistence, instanceData) {
//     const { domain, type, id, relationship } = req.params;
//     const { body } = req;
//
//     return Promise.resolve()
//     ;
// }

function handleAggregation(req, res, resource, persistence, instanceData) {
    const { domain, relationship } = req.params;

    return Promise.resolve()
        .then(() => instanceData.entity.getRelationshipByName(relationship))
        .then((relationshipModel) => Promise.resolve()
            .then(() => warpCore.getDomainByName(domain))
            .then((level1Domain) => instanceData.entity.createChildForInstance(
                instanceData.instance,
                relationshipModel,
                level1Domain.createNewID()
            ))
            .then((child) => Promise.resolve()
                .then(() => {
                    // TODO: Changelog createEntity()
                })
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

function handleAssociation(req, res, resource, persistence, instanceData) {
    const { body } = req;

    return Promise.resolve()
        .then(() => DocLevel.fromString(body.docLevel))
        .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
        .then((docLevelData) => docLevelData.model.addValue(persistence, body.type, body.id, docLevelData.instance))
        .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
        .then(() => {
            // TODO: logger
        })
    ;
}

function handleEmbedded(req, res, resource, persistence, instanceData) {
    const { body } = req;
    const { domain } = req.params;

    return Promise.resolve()
        .then(() => DocLevel.fromString(body.docLevel))
        .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
        .then((docLevelData) => Promise.resolve()
            .then(() => docLevelData.model.getTargetReferences(docLevelData.instance))
            .then((references) => Promise.resolve()
                .then(() => warpCore.getDomainByName(domain))
                .then((level1Domain) => {
                    const newInstance = docLevelData.model.getTargetEntity().newInstance(null, level1Domain.createNewID());
                    references.push(newInstance);
                    return newInstance;
                })
            )
        )
        .then((newInstance) => {
            // TODO: ChangeLog
        })
        .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
        .then(() => {
            // TODO: logger
        })
    ;
}

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;
    // const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        title: `New child for relationship ${domain} - ${type} - ${id} - ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    // debug(`${req.warpjsRequestToken}: domain=${domain}; type=${type}; id=${id}; relationship=${relationship}; body=`, body);

    return Promise.resolve()
        .then(() => {
            // TODO: Add logger
        })
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => Promise.resolve()
                // .then(() => debug(`instanceData=`, instanceData))
                // TODO: handleTargetEntity
                .then(() => instanceData.entity.getRelationshipByName(relationship))
                .then((relationshipModel) => {
                    const targetEntity = relationshipModel.getTargetEntity();
                    const isDocument = targetEntity.isDocument();
                    const isAggregation = relationshipModel.isAggregation;

                    if (isDocument) {
                        if (isAggregation) {
                            // Aggregation
                            return handleAggregation(req, res, resource, persistence, instanceData);
                        } else {
                            // Association
                            return handleAssociation(req, res, resource, persistence, instanceData);
                        }
                    } else {
                        // Embedded!
                        return handleEmbedded(req, res, resource, persistence, instanceData);
                    }
                })
            )
            .then(() => warpCore.removeDomainFromCache(domain))
            .finally(() => persistence.close())
        )
        .then(() => utils.sendHal(req, res, resource))
        .catch((err) => {
            console.error(`Error creating new relationship child. err=`, err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
