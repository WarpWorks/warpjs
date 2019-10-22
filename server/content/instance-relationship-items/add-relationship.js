const ChangeLogs = require('@warp-works/warpjs-change-logs');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const DOCUMENT_STATUS = require('./../../../lib/constants/document-status');
const allRoutes = require('./../../../lib/constants/routes');

const { routes } = require('./../constants');
const debug = require('./debug')('add-relationship');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = async (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    debug(`(): domain=${domain}, type=${type}, id=${id}, relationship=${relationship}`);
    debug(`(): body=`, body);

    const resource = warpjsUtils.createResource(req, {
        domain,
        type,
        id,
        relationship,
        body
    });

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const instance = await entity.getInstance(persistence, id);
        const relationshipInstance = entity.getRelationshipByName(relationship);

        if (relationshipInstance.isAggregation) {
            const child = await relationshipInstance.addAggregation(persistence, entity, instance, body.entity);
            const childEntity = entity.getDomain().getEntityByInstance(child);

            // Make sure the top level document is Draft.
            child.Status = DOCUMENT_STATUS.DRAFT;

            let savedChild;
            if (child.id) {
                await childEntity.updateDocument(persistence, child);
                savedChild = child;
            } else {
                savedChild = await childEntity.createDocument(persistence, child);
            }

            ChangeLogs.add(ChangeLogs.ACTIONS.ENTITY_CREATED, req.warpjsUser, child, {
                label: childEntity.getDisplayName(instance),
                type: instance.type,
                id: instance.id
            });
            await childEntity.updateDocument(persistence, savedChild);

            ChangeLogs.add(ChangeLogs.ACTIONS.AGGREGATION_ADDED, req.warpjsUser, instance, {
                label: entity.getDisplayName(savedChild),
                type: savedChild.type,
                id: savedChild.id
            });

            resource.link('newChildPortal', {
                title: "Newly created child",
                href: RoutesInfo.expand(allRoutes.portal.entity, {
                    type: savedChild.type,
                    id: savedChild.id
                })
            });
        } else if (!relationshipInstance.getTargetEntity().isDocument()) {
            // TODO: This cannot handle creating an embedded yet.
            throw new Error(`Unexpected embedded relationship '${relationship}'.`);
        } else {
            await relationshipInstance.addAssociation(instance, body, persistence);
        }

        await entity.updateDocument(persistence, instance, true);

        const href = RoutesInfo.expand(routes.instanceRelationshipItem, {
            domain,
            type,
            id,
            relationship,
            itemId: body.id
        });

        const refResource = warpjsUtils.createResource(href, {
            domain,
            type,
            id,
            relationship,
            itemId: body.id
        });

        resource.embed('references', refResource);

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`add-relationship item ERROR: err=`, err);
        resource.message = err.message;
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
