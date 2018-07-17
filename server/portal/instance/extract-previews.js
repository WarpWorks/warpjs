const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const serverUtils = require('./../../utils');
const walkExtract = require('./walk-extract');
const convertCustomLinks = require('./convert-custom-links');

function alreadyCached(cachedItems, instance) {
    return cachedItems.filter((cachedItem) => cachedItem.type === instance.type && cachedItem.id === instance.id).length !== 0;
}

function extractPreview(persistence, target, memo) {
    if (!alreadyCached(memo, target)) {
        return Promise.resolve()
            .then(() => serverUtils.getDomain())
            .then((domain) => domain.getEntityByInstance(target))
            .then((targetEntity) => walkExtract(persistence, targetEntity, target, [], config.previews.overviewPath))
            .then((overviews) => (overviews.length && overviews[0]) || null)
            .then((overview) => {
                if (overview) {
                    const href = RoutesInfo.expand('entity', {
                        type: target.type,
                        id: target.id
                    });

                    const resource = warpjsUtils.createResource(href, {
                        title: overview.Heading, // FIXME: Hard-coded attribute 'Heading'.
                        content: convertCustomLinks(overview.Content) // FIXME: Hard-coded attribute 'Content'.
                    });

                    resource.link('preview', RoutesInfo.expand('W2:portal:preview', {
                        type: target.type,
                        id: target.id
                    }));

                    return memo.concat(resource);
                } else {
                    return memo;
                }
            })
        ;
    } else {
        return memo;
    }
}

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => walkExtract(persistence, entity, instance, [], config.previews.relationshipPath))
    .then((targets) => Promise.reduce(
        targets,
        (memo, target) => extractPreview(persistence, target, memo),
        []
    ))
;
