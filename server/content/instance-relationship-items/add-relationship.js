const debug = require('debug')('W2:content:instance-relationship-items/add-relationship');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const allRoutes = require('./../../../lib/constants/routes');

const { routes } = require('./../constants');
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

            // TODO: ChangeLog to child.

            const childEntity = entity.getDomain().getEntityByInstance(child);

            let savedChild;
            if (child.id) {
                await childEntity.updateDocument(persistence, child);
                savedChild = child;
            } else {
                savedChild = await childEntity.createDocument(persistence, child);
            }

            // TODO: Add ChangeLog to instance.

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

        // TODO: Add history
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
