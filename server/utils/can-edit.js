const warpjsPlugins = require('@warp-works/warpjs-plugins');

module.exports = async (persistence, entity, instance, user) => {
    const plugin = warpjsPlugins.getPlugin('session');

    if (plugin) {
        return plugin.module.canEdit(plugin.config, persistence, entity, instance, user);
    } else {
        // If no session plugin, assume everyone has write access.
        return true;
    }
};
