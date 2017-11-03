function isAuthPlugin(plugin, authPluginName) {
    return plugin.name === authPluginName;
}

module.exports = (config) => {
    const pluginName = config['auth-plugin'];

    if (pluginName) {
        return config.plugins.filter((plugin) => isAuthPlugin(plugin, pluginName)).pop();
    } else {
        return null;
    }
};
