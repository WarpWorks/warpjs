const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

const getTypes = require('./get-types');
const getInstances = require('./get-instances');

// const debug = require('./debug')('get');

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;
    const { entity } = req.query;

    const description = entity ? `Get documents of '${entity}'` : `Get types`;

    const resource = warpjsUtils.createResource(
        req,
        {
            domain,
            type,
            id,
            description
        },
        req
    );

    const persistence = serverUtils.getPersistence(domain);

    try {
        const entityInstance = await serverUtils.getEntity(domain, type);
        const document = await entityInstance.getInstance(persistence, id);
        const parentData = await entityInstance.getParentData(persistence, document);

        const items = entity ? await getInstances(req, persistence, document, parentData, entity) : await getTypes(req, persistence, document, parentData);
        resource.embed('items', items);

        utils.sendHal(req, res, resource);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`change-parent/get: *** ERROR ***`, err);
        utils.sendErrorHal(req, res, resource, err);
    } finally {
        persistence.close();
    }
};
