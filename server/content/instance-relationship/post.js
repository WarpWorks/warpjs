// const debug = require('debug')('W2:content:instance-relationship/post');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
const { routes } = require('./../constants');
const EntityTypes = require('./../../../lib/core/entity-types');
const logger = require('./../../loggers');
const postAggregation = require('./post-aggregation');
const postAssociation = require('./post-association');
const postEmbedded = require('./post-embedded');
const serverUtils = require('./../../utils');
const utils = require('./../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = async (req, res) => {
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

    try {
        logger(req, "Trying to create relationship");
        const entity = await serverUtils.getEntity(domain, type);
        const relationshipEntity = entity.getRelationshipByName(relationship);
        const targetEntity = relationshipEntity.getTargetEntity();

        let instance;
        try {
            instance = await entity.getInstance(persistence, id);
        } catch (err) {
            serverUtils.documentDoesNotExist(req, res);
        }

        const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);
        if (!canEdit) {
            throw new WarpWorksError(`You do not have permission to create this entry.`);
        }

        const documents = await relationshipEntity.getDocuments(persistence, instance);
        const templateInstance = documents.find((document) => document.Name === 'TEMPLATE');

        if (templateInstance) {
            const templateEntity = entity.getDomain().getEntityByInstance(templateInstance);
            const deepCopy = await templateEntity.clone(persistence, templateInstance);
            deepCopy.Version = instance.Version || DEFAULT_VERSION;
            const redirectUrl = RoutesInfo.expand(routes.instance, {
                domain,
                type: deepCopy.type,
                id: deepCopy.id
            });
            utils.sendRedirect(req, res, resource, redirectUrl);
        } else {
            let impl;

            if (targetEntity.entityType === EntityTypes.EMBEDDED) {
                impl = postEmbedded;
            } else if (body.id && body.type) {
                impl = postAssociation;
            } else {
                impl = postAggregation;
            }

            await impl(req, res, persistence, entity, instance, resource);
        }
    } catch (err) {
        logger(req, "Failed", { err });
        serverUtils.sendError(req, res, err);
    } finally {
        persistence.close();
    }
};
