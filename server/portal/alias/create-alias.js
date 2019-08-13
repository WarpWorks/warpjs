const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const aliasNameValidator = require('./../../../lib/core/validators/alias-name');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

const { ALIAS_RELATIONSHIP_NAME, PREDECESSOR_RELATIONSHIP_NAME } = require('./constants');

const debug = require('./debug')('create-alias');

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { body } = req;

    debug(`type=${type}, id=${id}, body=`, body);

    const resource = warpjsUtils.createResource(
        req,
        {
            description: `Create a new alias for document`,
            type,
            id,
            body
        },
        req
    );

    const persistence = await serverUtils.getPersistence();
    try {
        if (!aliasNameValidator(body.value)) {
            throw new Error(`Alias name '${body.value}' is invalid.`);
        }

        const typeEntity = await serverUtils.getEntity(null, type);
        if (!typeEntity) {
            throw new Error(`Cannot find entity '${type}'`);
        }

        const typeDocument = await typeEntity.getInstance(persistence, id);
        if (!typeDocument) {
            throw new Error(`Cannot find document ${type}/${id}.`);
        }

        const aliasRelationship = typeEntity.getRelationshipByName(ALIAS_RELATIONSHIP_NAME);
        if (!aliasRelationship) {
            throw new Error(`Entity '${type}' doesn't have relationship '${ALIAS_RELATIONSHIP_NAME}'`);
        }

        const aliasEntity = aliasRelationship.getTargetEntity();

        const existingAliasDocuments = await aliasEntity.getDocuments(persistence);
        const existingAliases = existingAliasDocuments.map((existingAliasDocument) => existingAliasDocument.Name);
        if (existingAliases.indexOf(body.value) !== -1) {
            throw new Error(`Alias '${body.value}' already used by another document.`);
        }

        const newAliasInstance = aliasEntity.newInstance(aliasRelationship);
        newAliasInstance.Name = body.value; // FIXME: Use BasicProperty.
        const newAliasDocument = await aliasEntity.createDocument(persistence, newAliasInstance);
        debug(`newAliasDocument=`, newAliasDocument);

        const aliasData = {
            type: newAliasDocument.type,
            typeID: newAliasDocument.typeID || aliasEntity.id,
            id: newAliasDocument.id,
            desc: "New alias created",
            position: 0
        };
        await aliasRelationship.addAssociation(typeDocument, aliasData, persistence);
        debug(`aliasRelationship.addAssociation() done.`);

        // Find all predecessors and successor and add the Association.
        debug(`Getting relationship ${PREDECESSOR_RELATIONSHIP_NAME}`);
        const predecessorRelationship = typeEntity.getRelationshipByName(PREDECESSOR_RELATIONSHIP_NAME);
        if (predecessorRelationship) {
            await recursiveAdd(persistence, predecessorRelationship, typeDocument, aliasData);

            const successorRelationship = predecessorRelationship.getReverseRelationship();
            await recursiveAdd(persistence, successorRelationship, typeDocument, aliasData);
        }
        await typeEntity.updateDocument(persistence, typeDocument);

        const aliasHref = RoutesInfo.expand(routes.portal.entity, {
            type: newAliasDocument.type,
            id: newAliasDocument.id
        });
        const aliasResource = warpjsUtils.createResource(
            aliasHref,
            {
                type: newAliasDocument.type,
                typeID: newAliasDocument.typeID,
                id: newAliasDocument.id,
                name: newAliasDocument.Name
            },
            req
        );

        resource.embed('items', aliasResource);

        warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
    } finally {
        persistence.close();
    }
};

const recursiveAdd = async (persistence, relationship, document, aliasData) => {
    debug(`recursiveAdd(): relationship=${relationship.name}, document=`, document);
    const relatedDocments = await relationship.getDocuments(persistence, document);
    if (relatedDocments && relatedDocments.length) {
        debug(`recursiveAdd(): relatedDocments=`, relatedDocments);
        const domain = relationship.getDomain();
        await Promise.each(
            relatedDocments,
            async (relatedDocument) => {
                try {
                    debug(`recursiveAdd(): Promise.each(): relatedDocument=`, relatedDocument);
                    await relationship.addAssociation(relatedDocument, aliasData, persistence);
                    const relatedDocumentEntity = domain.getEntityByInstance(relatedDocument);
                    // TODO: Add ChangeLog
                    await relatedDocumentEntity.updateDocument(persistence, relatedDocument);
                    await recursiveAdd(persistence, relationship, relatedDocument, aliasData);
                } catch (err) {
                    console.error(`Error in Promise.each(): err=`, err);
                }
            }
        );
    } else {
        debug(`recursiveAdd(): no relatedDocuments`);
    }
};
