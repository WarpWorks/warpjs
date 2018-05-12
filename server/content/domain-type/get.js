const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type } = req.params;

    Promise.resolve()
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => {
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
                    .filter((entity) => entity.entityType === EntityTypes.DOCUMENT)
                    .sort(warpjsUtils.byPositionThenName)
                    .map((entity) => entity.toResource());

                resource.embed('entities', childEntities);
            }

            utils.sendHal(req, res, resource);
        })
    ;
};
