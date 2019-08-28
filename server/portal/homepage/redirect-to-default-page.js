const Document = require('./../../../lib/core/first-class/document');
const Documents = require('./../../../lib/core/first-class/documents');
const serverUtils = require('./../../utils');

// const debug = require('./debug')('redirect-to-default-page');

module.exports = async (req, res) => {
    const persistence = serverUtils.getPersistence();

    try {
        const rootEntity = await serverUtils.getRootEntity();
        const domain = rootEntity.getDomain();

        const docs = await rootEntity.getDocuments(persistence);
        const bestDocuments = await Documents.bestDocuments(persistence, domain, docs);
        const doc = bestDocuments[0];

        const url = await Document.getPortalUrl(persistence, domain.getEntityByInstance(doc), doc);

        res.redirect(url);
    } catch (err) {
        serverUtils.sendError(req, res, err);
    } finally {
        persistence.close();
    }
};
