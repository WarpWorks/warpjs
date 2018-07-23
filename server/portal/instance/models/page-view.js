const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/models/page-view');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Panel = require('./panel');

class PageView {
    constructor() {
        this.entity = null;
        this.instance = null;
        this.isOfStyle = {};
        this.panels = [];
    }

    extract(persistence, entity, instance, pageViewName) {
        // debug(`extract(): entity=`, entity);
        // debug(`extract(): instance=`, instance);

        this.entity = entity;
        this.instance = instance;
        this.panels = [];

        // FIXME: Loop in the real possible values from the level0 document.
        this.isOfStyle = Object.freeze(_.reduce(
            [
                'Plain',
                'BoK',
                'Insight',
                'Testbed'
            ],
            (styles, style) => _.extend(styles, {
                [style]: style === entity.style
            }),
            {}
        ));

        if (this.isOfStyle.BoK) {
        } else if (this.isOfStyle.Insight) {
        } else if (this.isOfStyle.Testbed) {
        } else {
            // Anything else is considered 'Plain'.
            return Promise.resolve()
                .then(() => entity.getPanels())
                .then((panels) => panels.sort(warpjsUtils.byPositionThenName))
                .then((panels) => Promise.map(panels, (panel) => (new Panel()).extract(persistence, panel, instance)))
                .then((panels) => {
                    this.overviews = panels;
                })
            ;
        }
    }

    toHal() {
        const href = '';
        const resource = warpjsUtils.createResource(href, {
            id: this.entity.id,
            type: this.entity.type,
            name: this.entity.name,
            desc: this.entity.desc,
            label: this.entity.label,
            style: this.entity.style,
            isOfStyle: _.clone(this.isOfStyle)
        });

        if (this.overviews && this.overviews.length) {
            resource.embed('overviews', this.overviews.map((panel) => panel.toHal()));
        }

        return resource;
    }
}

module.exports = PageView;
