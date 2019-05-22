const Promise = require('bluebird');

const debug = require('./debug')('redirect-alias');
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
                    memo[pathAlias.Name] = Object.freeze({
                        url: pathAlias.URL
                    });
                } else {
                    const references = await relationship.getTargetReferences(pathAlias);
                    if (references && references.length) {
                        memo[pathAlias.Name] = Object.freeze({
                            id: references[0]._id,
                            type: references[0].type,
                            view: pathAlias.View || undefined
                        });
                    }
                }
                return memo;
            },
            {}
        );

        debug(`cache=`, cache);
    }

    if (cache && cache.aliases && cache.aliases[alias]) {
        const documentInfo = cache.aliases[alias];
        debug(`documentInfo=`, documentInfo);
        if (documentInfo.url) {
            // Sending 307 because this path may change, so we want the user to
            // come back and double check next time.
            res.redirect(307, documentInfo.url);
        } else {
            const extractInstance = require('./../../portal/instance/extract-instance');
            await extractInstance(req, res, documentInfo.type, documentInfo.id, documentInfo.view);
        }
    } else {
        res.status(404).send();
    }
};
