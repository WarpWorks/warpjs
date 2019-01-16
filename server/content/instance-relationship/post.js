// const debug = require('debug')('W2:content:instance-relationship/post');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');
const EntityTypes = require('./../../../lib/core/entity-types');
const logger = require('./../../loggers');
const postAggregation = require('./post-aggregation');
const postAssociation = require('./post-association');
const postEmbedded = require('./post-embedded');
const serverUtils = require('./../../utils');
const utils = require('./../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    // debug(`domain=${domain}, type=${type}, id=${id}, relationship=${relationship}`);
    // debug(`body=`, body);

    const persistence = serverUtils.getPersistence(domain);

    const resource = warpjsUtils.createResource(req, {
        title: `Child for domain ${domain} - Type ${type} - Id ${id} - Relationship ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    Promise.resolve()
        .then(() => logger(req, "Trying to create relationship"))
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getRelationshipByName(relationship))
            .then((relationshipEntity) => Promise.resolve()
                .then(() => relationshipEntity.getTargetEntity())
                .then((targetEntity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, id))
                    .then(
                        (instance) => Promise.resolve()
                            .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                            .then((canEdit) => {
                                if (!canEdit) {
                                    throw new WarpWorksError(`You do not have permission to create this entry.`);
                                }
                            })

                            .then(() => relationshipEntity.getDocuments(persistence, instance))
                            .then((documents) => documents.find((document) => document.Name === 'TEMPLATE'))
                            .then((templateInstance) => {
                                if (templateInstance) {
                                    // debug(`found TEMPLATE, need deep-copy`);
                                    return Promise.resolve()
                                        .then(() => entity.getDomain().getEntityByInstance(templateInstance))
                                        .then((templateEntity) => templateEntity.clone(persistence, templateInstance))
                                        .then((deepCopy) => RoutesInfo.expand(routes.instance, {
                                            domain,
                                            type: deepCopy.type,
                                            id: deepCopy.id
                                        }))
                                        .then((redirectUrl) => utils.sendRedirect(req, res, resource, redirectUrl))
                                    ;
                                } else {
                                    return Promise.resolve()
                                        .then(() => (targetEntity.entityType === EntityTypes.EMBEDDED)
                                            ? postEmbedded
                                            : (body.id && body.type)
                                                ? postAssociation
                                                : postAggregation
                                        )
                                        .then((impl) => impl(req, res, persistence, entity, instance, resource))
                                    ;
                                }
                            })
                        ,
                        () => serverUtils.documentDoesNotExist(req, res)
                    )
                )
            )
        )
        .catch((err) => {
            logger(req, "Failed", { err });
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close())
    ;
};
