const _ = require('lodash');

class WarpjsPlugin {
    constructor(config, plugin) {
        this.name = plugin.name;
        this.moduleName = plugin.moduleName || plugin.name;
        this.path = plugin.path;
        this.type = plugin.type;
        this.config = _.extend({}, plugin.config, {
            domainName: config.domainName,
            persistence: _.cloneDeep(config.persistence)
        });

        this.module = require(this.moduleName);
        try {
            this.version = require(`${this.moduleName}/package.json`).version;
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
            moduleName: this.moduleName,
            type: this.type,
            path: this.path,
            version: this.version
        };
    }
}

module.exports = WarpjsPlugin;
