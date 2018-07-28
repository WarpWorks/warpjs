const constants = require('./constants');

module.exports = (panelItem) => Object.freeze({
    type: panelItem.type,
    id: panelItem.id,
    name: panelItem.name,
    description: panelItem.desc,
    label: panelItem.label || panelItem.name,
    isOfType: constants.isOfPanelItemType(panelItem)
});
