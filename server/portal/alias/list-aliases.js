const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

module.exports = async (req, res) => {
    const resource = warpjsUtils.createResource(
        req,
        {
            description: `List of aliases`
        },
        req
    );

    const pathAliasEntity = await serverUtils.getEntity(null, 'PathAlias');

    const persistence = await serverUtils.getPersistence();

    try {
        const pathAliasDocuments = await pathAliasEntity.getDocuments(persistence);
        resource.items = pathAliasDocuments.map((pathAliasDocument) => pathAliasDocument.Name);
        warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
    } finally {
        persistence.close();
    }
};
