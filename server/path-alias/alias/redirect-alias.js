const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

const cache = {
    timestamp: null,
    aliases: {}
};

module.exports = async (req, res) => {
    const { alias } = req.params;

    if (!cache.timestamp || cache.timestamp < Date.now()) {
        const persistence = serverUtils.getPersistence();
        const entity = await serverUtils.getEntity(null, 'PathAlias');
        const relationship = entity.getRelationshipByName('Target');
        const pathAliases = await entity.getDocuments(persistence);

        cache.timestamp = Date.now() + 5 * 60 * 1000;

        cache.aliases = await Promise.reduce(
            pathAliases,
            async (memo, pathAlias) => {
                if (pathAlias.URL) {
                    memo[pathAlias.Name] = pathAlias.URL;
                } else {
                    const references = await relationship.getTargetReferences(pathAlias);
                    if (references && references.length) {
                        const reference = {
                            id: references[0]._id,
                            type: references[0].type,
                            view: pathAlias.View
                        };

                        memo[pathAlias.Name] = RoutesInfo.expand(routes.portal.entity, reference);
                    }
                }
                return memo;
            },
            {}
        );
    }

    if (cache && cache.aliases && cache.aliases[alias]) {
        // Sending 307 because this path may change, so we want the user to come
        // back and double check next time.
        res.redirect(307, cache.aliases[alias]);
    } else {
        res.status(404).send();
    }
};
