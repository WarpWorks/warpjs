const extend = require('lodash/extend');

// const debug = require('./debug')('aliases');
const serverUtils = require('./../../../server/utils');

const VALIDITY = 5 * 60 * 1000;

let timestamp;
let cache;

const reset = async () => {
    const persistence = serverUtils.getPersistence();
    const entity = await serverUtils.getEntity(null, 'PathAlias');
    const relationship = entity.getRelationshipByName('Target');
    const pathAliases = await entity.getDocuments(persistence);

    timestamp = Date.now() + VALIDITY;

    cache = pathAliases.reduce(
        (memo, pathAlias) => {
            if (pathAlias.URL) {
                return extend(memo, {
                    [pathAlias.Name]: Object.freeze({
                        url: pathAlias.URL
                    })
                });
            } else {
                const references = relationship.getTargetReferences(pathAlias);
                if (references && references.length) {
                    return extend(memo, {
                        [pathAlias.Name]: Object.freeze({
                            id: references[0]._id,
                            type: references[0].type,
                            typeID: references[0].typeID,
                            view: pathAlias.View || undefined
                        })
                    });
                } else {
                    return memo;
                }
            }
        },
        {}
    );
};

const get = async (path) => {
    if (!timestamp || timestamp < Date.now()) {
        await reset();
    }
    path = (path[0] === '/') ? path.substr(1) : path;
    return cache[path];
};

module.exports = Object.freeze({
    get: async (path) => get(path),
    reset: async () => reset()
});
