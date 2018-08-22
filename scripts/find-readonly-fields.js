#!/usr/bin/env node

const _ = require('lodash');
const Promise = require('bluebird');

const serverUtils = require('./../server/utils');

const KEYS = ['entity', 'pageView', 'panel', 'panelItem'];

function pad(s, length, filler) {
    s = s || '';
    while (s.length < length) {
        s += filler || ' ';
    }
    return s;
}

function row(item, lengths, filler) {
    const columns = KEYS.map((key) => pad(item[key], lengths[key], filler));
    console.log(columns.join('   '));

}

function table(items) {
    const lengths = items.reduce(
        (accumulator, item) => {
            KEYS.forEach((key) => _.extend(accumulator, {
                [key]: Math.max(accumulator[key] || 0, item[key].length)
            }));
            return accumulator;
        },
        {}
    );

    row({entity: 'Entity', pageView: 'PageView', panel: 'Panel', panelItem: 'PanelItem'}, lengths);
    row({}, lengths, '=');
    items.forEach((item) => row(item, lengths));
}

Promise.resolve()
    .then(() => serverUtils.getDomain())
    .then((domain) => Promise.reduce(
        domain.getEntities(),
        (accumulator, entity) => Promise.resolve()
            .then(() => Promise.reduce(
                entity.getPageViews(true),
                (accumulator, pageView) => Promise.resolve()
                    .then(() => Promise.reduce(
                        pageView.getPanels(true),
                        (accumulator, panel) => Promise.resolve()
                            .then(() => Promise.reduce(
                                panel.getPanelItems(),
                                (accumulator, panelItem) => Promise.resolve()
                                    .then(() => panelItem.readOnly && (panelItem.type === 'BasicPropertyPanelItem' || panelItem.type === 'EnumPanelItem')
                                        ? accumulator.concat({ entity: entity.name, pageView: pageView.name, panel: panel.name, panelItem: panelItem.name })
                                        : accumulator
                                    )
                                ,
                                []
                            ))
                            .then((items) => items.length ? accumulator.concat(items) : accumulator)
                        ,
                        []
                    ))
                    .then((items) => items.length ? accumulator.concat(items) : accumulator)
                ,
                []
            ))
            .then((items) => items.length ? accumulator.concat(items) : accumulator)
        ,
        []
    ))
    .then((items) => table(items))
;
