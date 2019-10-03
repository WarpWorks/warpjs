const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Documents = require('./../../../lib/core/first-class/documents');
const routes = require('./../../../lib/constants/routes');

// const debug = require('./debug')('list-items-aggregation');

module.exports = async (persistence, relationship, document) => {
    const aggregationDocuments = await relationship.getDocuments(persistence, document);

    const nonTemplates = aggregationDocuments.filter((aggregationDocument) => aggregationDocument.Name !== 'TEMPLATE');
    const bestDocuments = await Documents.bestDocuments(persistence, relationship.getDomain(), nonTemplates);
    bestDocuments.sort(warpjsUtils.byPositionThenName);

    const domain = relationship.getDomain().name;

    return bestDocuments.map((aggregationDocument) => {
        const href = RoutesInfo.expand(routes.content.instance, {
            domain,
            type: aggregationDocument.type,
            id: aggregationDocument.id
        });

        const resource = warpjsUtils.createResource(href, {
            type: aggregationDocument.type,
            typeID: aggregationDocument.typeID,
            id: aggregationDocument.id,
            name: aggregationDocument.Name,
            position: aggregationDocument.Position
        });

        resource.link('portal', {
            title: `View document on portal`,
            href: RoutesInfo.expand(routes.portal.entity, {
                type: aggregationDocument.type,
                id: aggregationDocument.id
            })
        });

        return resource;
    });
};
