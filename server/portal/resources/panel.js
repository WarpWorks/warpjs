const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('panel');
const panelItemsByPanel = require('./panel-items-by-panel');

module.exports = async (persistence, panel, instance) => {
    const resource = warpjsUtils.createResource('', {
        type: panel.type,
        id: panel.id,
        name: panel.name,
        description: panel.desc,
        label: panel.label || panel.name,
        style: panel.style,
        reference: {
            type: "Relationship",
            id: "32"
        }
    });

    const panelItems = await panelItemsByPanel(persistence, panel, instance);
    resource.embed('items', panelItems);
    resource.showPanel = Boolean(panelItems && panelItems.length);
    resource.visibleInEditOnly = panelItems.filter((pi) => !pi.visibleInEditOnly).length === 0;

    return resource;
};
