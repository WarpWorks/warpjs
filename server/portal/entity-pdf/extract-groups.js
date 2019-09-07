// const debug = require('./debug')('extract-groups');

module.exports = async (req, persistence, entity, document, relationshipName) => {
    const relationship = entity.getRelationshipByName(relationshipName);
    if (relationship) {
        const documents = await relationship.getDocuments(persistence, document);

        return documents.map((doc) => ({
            name: doc.Name
        }));
    }
};
