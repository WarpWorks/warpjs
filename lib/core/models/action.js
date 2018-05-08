const _ = require('lodash');
const Promise = require('bluebird');
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
        return _.extend({}, super.toJSON(), {
            pluginName: this.pluginName
        });
    }

    fromJSON(json) {
        this.pluginName = json.pluginName;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new Action(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
            pluginName: this.pluginName
        });
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource(relativeToDocument.href, _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.join('.'),
                relativeToDocument
            })))
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

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource(relativeToDocument.href, _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.toString(),
                relativeToDocument
            })))
            .then((resource) => Promise.resolve()
                .then(() => warpjsPlugins.getPluginByName(this.pluginName))
                .then((plugin) => Promise.resolve()
                    .then(() => {
                        resource.glyphicon = plugin.config.glyphicon;
                        resource.label = plugin.config.label;
                        resource.pluginIdentifier = plugin.module.getPluginIdentifier();
                    })

                    .then(() => plugin.module.getJsScriptUrl())
                    .then((href) => resource.link('jsScript', {
                        href,
                        title: this.pluginName
                    }))

                    .then(() => plugin.module.getRootUrl(relativeToDocument.domain, relativeToDocument.type, relativeToDocument.id))
                    .then((href) => resource.link('plugin', {
                        href,
                        title: "Plugin's root URL"
                    }))
                )
                .then(() => resource)
            )
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            pluginName: this.pluginName
        });

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.pluginName = json.pluginName;
            })
            .then(() => this)
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new Action(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

module.exports = Action;
