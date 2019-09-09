const warpjsUtils = require('@warp-works/warpjs-utils');

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

    try {
        const items = entity ? await getInstances(req, domain, type, id, entity) : await getTypes(req, domain, type, id);
        resource.embed('items', items);

        utils.sendHal(req, res, resource);
    } catch (err) {
        utils.sendErrorHal(req, res, resource, err);
    }
};
