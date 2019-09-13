// const debug = require('debug')('W2:content:entity-sibling/post');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
const { routes } = require('./../constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    const resource = warpjsUtils.createResource(
        req,
        {
            title: `Sibling for domain ${domain} - Type ${type} - Id ${id}`,
            domain,
            type,
            id
        },
        req
    );

    try {
        const entity = await serverUtils.getEntity(domain, type);
        const instance = await entity.getInstance(persistence, id);

        const parentData = await entity.getParentData(persistence, instance);
        const parentVersion = parentData && parentData.instance && parentData.instance.Version ? parentData.instance.Version : DEFAULT_VERSION;

        // TODO: check Edit permissions of the parent!!!

        const templateDocuments = await entity.getDocuments(persistence, {
            parentID: instance.parentID,
            parentRelnID: instance.parentRelnID,
            Name: 'TEMPLATE'
        }, true);

        const templateDocument = templateDocuments && templateDocuments.length ? templateDocuments[0] : null;

        if (templateDocument) {
            const templateEntity = entity.getDomain().getEntityByInstance(templateDocument);
            const deepCopy = await templateEntity.clone(persistence, templateDocument, null, parentVersion);
            const redirectUrl = RoutesInfo.expand(routes.instance, {
                domain,
                type: deepCopy.type,
                id: deepCopy.id
            });
            utils.sendRedirect(req, res, resource, redirectUrl);
        } else {
            const sibling = await entity.createSiblingForInstance(instance);
            sibling.Version = parentVersion;
            const newDoc = await entity.createDocument(persistence, sibling);
            const newId = newDoc.id;

            const redirectUrl = RoutesInfo.expand(routes.instance, {
                domain,
                type,
                id: newId
            });

            if (req.headers['x-requested-with']) {
                // Was ajax call. return a resource.
                resource.link('redirect', redirectUrl);

                utils.sendHal(req, res, resource);
            } else {
                // Direct call.
                res.redirect(redirectUrl);
            }
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("entity-sibling(): err=", err);
        resource.message = err.message;
        utils.sendHal(req, res, resource, 500);
    } finally {
        persistence.close();
    }
};
