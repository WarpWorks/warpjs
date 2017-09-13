const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;

    const entity = serverUtils.getEntity(domain, type);

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type}`,
        domain,
        type
    });

    resource.embed('model', entity.toResource());

    if (req.query.profile === 'withChildren') {
        const childEntities = entity.getChildEntities(true, true)
            .concat(entity)
            .filter((entity) => !entity.isAbstract)
            .filter((entity) => entity.entityType === 'Document')
            .sort(warpjsUtils.byPositionThenName)
            .map((entity) => entity.toResource());

        resource.embed('entities', childEntities);
    }

    utils.sendHal(req, res, resource);
};
