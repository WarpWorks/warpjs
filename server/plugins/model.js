const _ = require('lodash');

class WarpjsPlugin {
    constructor(config, plugin) {
        this.name = plugin.name;
        this.path = plugin.path;
        this.config = _.extend({}, plugin.config, {
            domainName: config.domainName,
            persistence: _.cloneDeep(config.persistence)
        });

        this.module = require(plugin.name);
        try {
            this.version = require(`${plugin.name}/package.json`).version;
        } catch (err) {
            this.version = '[unknown]';
        }
    }

    use(Persistence, app, baseUrl, staticUrl) {
        // HACK: require() called here to prevent a circular dependency.
        const warpCore = require('./../../lib/core');

        const pluginApp = this.module(this.config, warpCore, Persistence);

        app.use(this.path, pluginApp(baseUrl ? `${baseUrl}/${this.path}` : this.path, staticUrl));
    }

    info() {
        return {
            name: this.name,
            path: this.path,
            version: this.version
        };
    }
}

module.exports = WarpjsPlugin;
