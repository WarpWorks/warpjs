const warpjsUtils = require('@warp-works/warpjs-utils');

const Documents = require('./../../../lib/core/first-class/documents');

// const debug = require('./debug')('list-items-aggregation');

module.exports = async (persistence, relationship, document) => {
    const aggregationDocuments = await relationship.getDocuments(persistence, document);

    const nonTemplates = aggregationDocuments.filter((aggregationDocument) => aggregationDocument.Name !== 'TEMPLATE');
    const bestDocuments = await Documents.bestDocuments(persistence, relationship.getDomain(), nonTemplates);
    bestDocuments.sort(warpjsUtils.byPositionThenName);

    return bestDocuments.map((aggregationDocument) => warpjsUtils.createResource('', {
        type: aggregationDocument.type,
        typeID: aggregationDocument.typeID,
        id: aggregationDocument.id,
        name: aggregationDocument.Name,
        position: aggregationDocument.Position
    }));
};
