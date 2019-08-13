const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const aliasUtils = require('./../../../lib/core/first-class/aliases');
const aliasNameValidator = require('./../../../lib/core/validators/alias-name');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

const { ALIAS_RELATIONSHIP_NAME } = require('./constants');

// const debug = require('./debug')('rename-alias');

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { body } = req;

    // debug(`type=${type}, id=${id}, body=`, body);

    const resource = warpjsUtils.createResource(
        req,
        {
            description: `Rename an alias for a document`,
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

        const aliasDocuments = await aliasRelationship.getDocuments(persistence, typeDocument);
        if (!aliasDocuments.length) {
            throw new Error(`Document ${type}/${id} doesn't have an alias.`);
        } else if (aliasDocuments.length > 1) {
            throw new Error(`Document ${type}/${id} has more than one alias.`);
        } else if (aliasDocuments[0].View) {
            throw new Error(`Document ${type}/${id} has an alias with a view name.`);
        }
        const aliasDocument = aliasDocuments[0];

        const aliasEntity = aliasRelationship.getTargetEntity();
        const existingAliasDocuments = await aliasEntity.getDocuments(persistence);
        const existingAliases = existingAliasDocuments.map((existingAliasDocument) => existingAliasDocument.Name);
        if (existingAliases.indexOf(body.value) !== -1) {
            throw new Error(`Alias '${body.value}' already used by another document.`);
        }

        const oldName = aliasDocument.Name;
        aliasDocument.Name = body.value;

        // TODO: Add changelog

        // Removing the old alias and caching the new one.
        aliasUtils.remove(oldName);
        aliasUtils.get(body.value); // We don't need to wait for it to complete.

        await aliasEntity.updateDocument(persistence, aliasDocument, true);

        const aliasHref = RoutesInfo.expand(routes.portal.entity, {
            type: aliasDocument.type,
            id: aliasDocument.id
        });
        const aliasResource = warpjsUtils.createResource(
            aliasHref,
            {
                type: aliasDocument.type,
                typeID: aliasDocument.typeID,
                id: aliasDocument.id,
                oldName,
                newName: aliasDocument.Name
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
