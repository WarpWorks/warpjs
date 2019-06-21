const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:studio:relationship/create-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const DocLevel = require('./../../../lib/doc-level');
const { actions } = require('./../../../lib/constants');
const logger = require('./../../loggers');
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
    const { body } = req;

    const ACTION = actions.ADD_ASSOCIATION;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${ACTION}`, body))
        .then(() => instanceData.entity.getRelationshipByName(relationship))
        .then((relationshipModel) => Promise.resolve()
            .then(() => warpCore.getDomainByName(domain))
            .then((level1Domain) => instanceData.entity.createChildForInstance(
                instanceData.instance,
                relationshipModel,
                level1Domain.createNewID()
            ))
            .then((child) => Promise.resolve()
                .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.ENTITY_CREATED, req.warpjsUser, child, {
                    label: instanceData.entity.getDisplayName(instanceData.instance),
                    type: instanceData.entity.name, // FIXME: use schemaId
                    id: instanceData.instance.id
                }))
                .then(() => relationshipModel.getTargetEntity())
                .then((targetEntity) => Promise.resolve()
                    .then(() => targetEntity.createDocument(persistence, child))
                    .then((newDoc) => Promise.resolve()
                        .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.AGGREGATION_ADDED, req.warpjsUser, instanceData.instance, {
                            key: relationship,
                            type: newDoc.type,
                            id: newDoc.id
                        }))
                        .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance, false))
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
        .then(() => logger(req, `Success ${ACTION}`))
    ;
}

function handleAssociation(req, res, resource, persistence, instanceData) {
    console.log('got to handleAssociation');
    const { body } = req;

    const ACTION = actions.ADD_ASSOCIATION;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${ACTION}`, body))
        .then(() => DocLevel.fromString(body.docLevel))
        .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
        .then((docLevelData) => docLevelData.model.addValue(persistence, body.type, body.id, docLevelData.instance))
        .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance, false))
        .then(() => logger(req, `Success ${ACTION}`))
    ;
}

function handleEmbedded(req, res, resource, persistence, instanceData) {
    const { body } = req;
    const { domain } = req.params;

    const ACTION = actions.ADD_EMBEDDED;

    console.log('body.docLevel:::::', body.docLevel, 'instanceData.entity:::', instanceData.entity, 'instanceData.instance::::', instanceData.instance);

    return Promise.resolve()
        .then(() => logger(req, `Trying ${ACTION}`, body))
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
        .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance, false))
        .then(() => logger(req, `Success ${ACTION}`))
    ;
}

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `New child for relationship ${domain} - ${type} - ${id} - ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    // const { body } = req;
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
            // eslint-disable-next-line no-console
            console.error(`Error creating new relationship child. err=`, err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
