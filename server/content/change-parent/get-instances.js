const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

const debug = require('./debug')('get-instances');

module.exports = async (req, domain, type, id, entity) => {
    const persistence = serverUtils.getPersistence(domain);

    try {
        const entityInstance = await serverUtils.getEntity(domain, type);
        const documents = await entityInstance.getDocuments(persistence);

        debug(`documents=`, documents.length);

        return Promise.map(documents, async (document) => {
            const resource = warpjsUtils.createResource('', {
                type: document.type,
                typeID: document.typeID,
                id: document.id,
                name: document.Name, // FIXME: Use BasicProperty
                version: document.Version, // FIXME: Use BasicProperty
                status: document.Status, // FIXME: Use BasicProperty
                selected: document.id === id
            });

            return resource;
        });
    } finally {
        persistence.close();
    }
};
