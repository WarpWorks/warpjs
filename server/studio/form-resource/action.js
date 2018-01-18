const Promise = require('bluebird');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()
    .then(() => warpjsUtils.createResource(relativeToDocument.href, {
        name: entity.name,
        desc: entity.desc,
        type: entity.type,
        id: entity.idToJSON(),
        docLevel: docLevel.join('.'),
        relativeToDocument
    }))
    .then((resource) => Promise.resolve()
        .then(() => warpjsPlugins.getPluginByName(entity.pluginName))
        .then((plugin) => Promise.resolve()
            .then(() => {
                resource.glyphicon = plugin.config.glyphicon;
                resource.label = plugin.config.label;
                resource.pluginIdentifier = plugin.module.getPluginIdentifier();
            })

            .then(() => plugin.module.getJsScriptUrl())
            .then((jsScriptUrl) => resource.link('jsScript', {
                href: jsScriptUrl,
                title: entity.pluginName
            }))

            .then(() => plugin.module.getRootUrl(relativeToDocument.domain, relativeToDocument.type, relativeToDocument.id))
            .then((pluginRootUrl) => resource.link('plugin', {
                href: pluginRootUrl,
                title: "Plugin's root URL"
            }))
        )
        .then(() => resource)
    )
;
