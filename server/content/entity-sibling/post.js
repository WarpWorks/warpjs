const debug = require('debug')('W2:content:entity-sibling/post');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    const resource = warpjsUtils.createResource(req, {
        title: `Sibling for domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id
    });

    return Promise.resolve()
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getInstance(persistence, id))

            .then((instance) => Promise.resolve()
                // TODO: check Edit permissions of the parent!!!

                // Find sibling TEMPLATE.
                .then(() => entity.getDocuments(persistence, {
                    parentID: instance.parentID,
                    parentRelnID: instance.parentRelnID,
                    Name: 'TEMPLATE'
                }, true))
                .then((templateDocuments) => templateDocuments && templateDocuments.length ? templateDocuments[0] : null)
                .then((templateDocument) => {
                    if (templateDocument) {
                        return Promise.resolve()
                            .then(() => entity.getDomain().getEntityByInstance(templateDocument))
                            .then((templateEntity) => templateEntity.clone(persistence, templateDocument))
                            .then((deepCopy) => RoutesInfo.expand(routes.instance, {
                                domain,
                                type: deepCopy.type,
                                id: deepCopy.id
                            }))
                            .then((redirectUrl) => utils.sendRedirect(req, res, resource, redirectUrl))
                        ;
                    } else {
                        return Promise.resolve()
                            .then(() => entity.createSiblingForInstance(instance))
                            .then((sibling) => entity.createDocument(persistence, sibling))
                            .then((newDoc) => newDoc.id)
                            .then((newId) => {
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
                            })
                        ;
                    }
                })
            )
        )
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error("entity-sibling(): err=", err);
            resource.message = err.message;
            utils.sendHal(req, res, resource, 500);
        })
        .finally(() => persistence.close())
    ;
};
