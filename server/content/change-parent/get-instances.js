const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./../../../lib/constants/routes');

// const debug = require('./debug')('get-instances');

module.exports = async (req, persistence, document, parentData, entity) => {
    const domainInstance = parentData.entity.getDomain();

    const entityInstance = domainInstance.getEntityByName(entity);
    const documents = await entityInstance.getDocuments(persistence);

    return Promise.map(documents, async (entityDocument) => warpjsUtils.createResource(
        RoutesInfo.expand(routes.content.changeParent, {
            domain: domainInstance.name,
            type: document.type,
            id: document.id
        }),
        {
            type: entityDocument.type,
            typeID: entityDocument.typeID,
            id: entityDocument.id,
            name: entityDocument.Name, // FIXME: Use BasicProperty
            version: entityDocument.Version, // FIXME: Use BasicProperty
            status: entityDocument.Status, // FIXME: Use BasicProperty
            selected: entityDocument.id === parentData.instance.id
        }
    ));
};
