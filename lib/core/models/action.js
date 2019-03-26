const extend = require('lodash/extend');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');

const TYPE = ComplexTypes.Action;

class Action extends Base {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
        this.pluginName = "";
    }

    toString() {
        return this.pluginName;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            pluginName: this.pluginName
        });
    }

    fromJSON(json) {
        super.fromJSON(json);
        this.pluginName = json.pluginName;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new Action(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            pluginName: this.pluginName
        });
    }

    async toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const plugin = await warpjsPlugins.getPluginByName(this.pluginName);

        const resource = warpjsUtils.createResource(relativeToDocument.href, extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.join('.'),
            relativeToDocument,
            glyphicon: plugin.config.glyphicon,
            label: plugin.config.label,
            pluginIdentifier: plugin.module.getPluginIdentifier()
        }));

        resource.link('jsScript', {
            href: plugin.module.getJsScriptUrl(),
            title: this.pluginName
        });

        const pluginRootUrl = await plugin.module.getRootUrl(relativeToDocument.domain, relativeToDocument.type, relativeToDocument.id);
        resource.link('plugin', {
            href: pluginRootUrl,
            title: "Plugin's root URL"
        });

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        const plugin = await warpjsPlugins.getPluginByName(this.pluginName);

        const resource = warpjsUtils.createResource(relativeToDocument.href, extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.toString(),
            relativeToDocument,
            glyphicon: plugin.config.glyphicon,
            label: plugin.config.label,
            pluginIdentifier: plugin.module.getPluginIdentifier()
        }));

        resource.link('jsScript', {
            href: await plugin.module.getJsScriptUrl(),
            title: this.pluginName
        });

        resource.link('plugin', {
            href: await plugin.module.getRootUrl(relativeToDocument.domain, relativeToDocument.type, relativeToDocument.id),
            title: "Plugin's root URL"
        });

        return resource;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            pluginName: this.pluginName
        });

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this.pluginName = json.pluginName;

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new Action(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = Action;
