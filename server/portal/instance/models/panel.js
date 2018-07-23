const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/models/panel');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const PanelItem = require('./panel-item');

class Panel {
    constructor() {
        this.entity = null;
        this.instance = null;
        this.panelItems = [];
        this.isOfStyle = {};
    }

    extract(persistence, entity, instance) {
        // debug("extract(): entity=", entity);
        this.entity = entity;
        this.instance = instance;
        this.panelItems = [];
        this.isOfStyle = Object.freeze(_.reduce(
            [
                'Overview',
                'Sidebar',
                'Summary',
                'Authors',
                'Header',
                'Badges'
            ],
            (styles, style) => _.extend(styles, {
                [style]: entity.name === style
            }),
            {}
        ));

        return Promise.resolve()
            .then(() => entity.getPanelItems())
            .then((panelItems) => Promise.map(
                panelItems,
                (panelItem) => (new PanelItem()).extract(persistence, panelItem, instance)
            ))
            .then((panelItems) => {
                this.panelItems = panelItems;
            })

            .then(() => this)
        ;
    }

    toHal() {
        const href = '';
        const resource = warpjsUtils.createResource(href, {
            name: this.entity.name,
            desc: this.entity.desc,
            label: this.entity.label,
            style: this.entity.style,
            isOfStyle: _.clone(this.isOfStyle)
        });

        return resource;
    }
}

module.exports = Panel;
