// const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtils = require('@warp-works/warpjs-utils');

const convertCustomLinks = require('./convert-custom-links');
const serverUtils = require('./../../utils');
const walkExtract = require('./walk-extract');

module.exports = async (req, res) => {
    const { type, id } = req.params;

    const persistence = serverUtils.getPersistence();
    const config = serverUtils.getConfig();

    try {
        const entity = await serverUtils.getEntity(null, type);
        const domain = entity.getDomain();

        // Try if in index first
        const plugin = warpjsPlugins.getPlugin('search');
        const indexed = plugin ? plugin.module.getDocument(plugin.config, type, id) : null;

        let resource;
        if (indexed) {
            const content = await convertCustomLinks(persistence, domain, indexed.snippet);
            resource = warpjsUtils.createResource(req, {
                type,
                id,
                title: indexed.title,
                desc: null,
                content
            });
        } else {
            const instance = await entity.getInstance(persistence, id);
            const overviews = await walkExtract(persistence, entity, instance, [], config.previews.overviewPath);
            const overview = overviews.length ? overviews[0] : null;

            const content = await convertCustomLinks(persistence, domain, overview ? overview.Content : null);
            resource = warpjsUtils.createResource(
                req,
                {
                    type,
                    id,
                    title: domain.getDisplayName(instance),
                    desc: instance.desc,
                    content
                },
                req
            );
        }

        warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        serverUtils.sendError(req, res, err);
    } finally {
        persistence.close();
    }
};
