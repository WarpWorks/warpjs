const Promise = require('bluebird');

const Document = require('./document');

class Documents {
    static async bestDocuments(persistence, domain, documents) {
        const bestDocuments = await Promise.map(
            documents,
            async (document) => {
                const documentEntity = domain.getEntityByInstance(document);
                return Document.bestDocument(persistence, documentEntity, document);
            }
        );

        return bestDocuments.reduce(
            (cumulator, bestDocument) => {
                const found = cumulator.find((item) => item.type === bestDocument.type && item.id === bestDocument.id);
                if (!found) {
                    return cumulator.concat(bestDocument);
                } else {
                    return cumulator;
                }
            },
            []
        );
    }
}

Documents.name = 'Documents';

module.exports = Documents;
