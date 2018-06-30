// const debug = require('debug')('W2:server:utils/menu-items');
const warpjsUtils = require('@warp-works/warpjs-utils');

const warpCore = require('./../../lib/core');

module.exports = (plugins, domain, type, id) => {
    // debug(`(): domain=${domain}, type=${type}, id=${id}, plugins=`, plugins);
    return plugins.map((plugin) => {
        // debug(`plugin=`, plugin);

        const warpjsPlugin = new plugin.Module(plugin.config, warpCore, plugin.type);

        const resource = warpjsUtils.createResource('', {
            name: plugin.name,
            desc: plugin.desc,
            type: plugin.type,
            id: 'something',
            label: plugin.config.label,
            glyphicon: plugin.config.glyphicon,
            pluginIdentifier: warpjsPlugin.pluginIdentifier
        });

        if (warpjsPlugin.jsScriptUrl) {
            resource.link('jsScript', warpjsPlugin.jsScriptUrl);
            resource.link('plugin', warpjsPlugin.getRootUrl(domain, type, id));
        } else {
            const path = warpjsPlugin.getRootUrl(domain, type, id) || plugin.path;
            resource.link('path', path);
        }

        return resource;
    });
};
