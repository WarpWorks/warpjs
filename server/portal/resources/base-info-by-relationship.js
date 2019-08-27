// const debug = require('debug')('W2:portal:resources/base-info-by-relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const Documents = require('./../../../lib/core/first-class/documents');
const routes = require('./../../../lib/constants/routes');
const visibleOnly = require('./visible-only');

module.exports = async (persistence, relationship, instance) => {
    const documents = await relationship.getDocuments(persistence, instance);
    const bestDocuments = await Documents.bestDocuments(persistence, relationship.getDomain(), documents);
    const filteredDocuments = bestDocuments.filter(visibleOnly);

    const domain = relationship.getDomain();

    return Promise.map(
        filteredDocuments,
        async (document) => {
            const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(document), document);

            const resource = warpjsUtils.createResource(href, {
                type: document.type,
                typeLabel: relationship.getTargetEntity().label || relationship.getTargetEntity().name,
                id: document.id,
                name: document.Name,
                relnDesc: document.relnDesc,
                relnPosition: document.relnPosition,
                label: relationship.getDisplayName(document)
            });

            resource.link('preview', RoutesInfo.expand(routes.portal.preview, { type: document.type, id: document.id }));

            return resource;
        }
    );
};
