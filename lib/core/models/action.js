const Promise = require('bluebird');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');

class Action extends Base {
    constructor(parent, id, name, desc) {
        super("Action", parent, id, name, desc);
        this.pluginName = "Plugin Name";
    }

    toString() {
        return this.pluginName;
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            pluginName: this.pluginName
        };
    }

    static fromJSON(parent, jsonData) {
        const newAction = new Action(parent, jsonData.id, jsonData.name, jsonData.desc);
        newAction.pluginName = jsonData.pluginName;
        return newAction;
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource(relativeToDocument.href, {
                name: this.name,
                desc: this.desc,
                type: this.type,
                id: this.idToJSON(),
                docLevel: docLevel.join('.'),
                relativeToDocument
            }))
            .then((resource) => Promise.resolve()
                .then(() => warpjsPlugins.getPluginByName(this.pluginName))
                .then((plugin) => Promise.resolve()
                    .then(() => {
                        resource.glyphicon = plugin.config.glyphicon;
                        resource.label = plugin.config.label;
                        resource.pluginIdentifier = plugin.module.getPluginIdentifier();
                    })
                    .then(() => plugin.module.getJsScriptUrl())
                    .then((jsScriptUrl) => resource.link('jsScript', {
                        href: jsScriptUrl,
                        title: this.pluginName
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
    }
}

module.exports = Action;
