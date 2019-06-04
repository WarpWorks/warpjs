module.exports = async (persistence, entityEntity, name) => {
    const documents = await entityEntity.getDocuments(persistence, { name });
    return documents && documents.length ? documents[0] : null;
};
