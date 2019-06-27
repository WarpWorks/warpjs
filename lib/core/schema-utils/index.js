const addChangesToBasicsPanel = require('./add-changes-to-basics-panel');
const createElements = require('./create-elements');
const findEntityChanges = require('./find-entity-changes');
const createTopLevelElements = require('./create-top-level-elements');

module.exports = Object.freeze({
    addChangesToBasicsPanel: async (DOMAIN, persistence, changesToMake) => addChangesToBasicsPanel(DOMAIN, persistence, changesToMake),
    createElements: async (DOMAIN, persistence, changesToMake) => createElements(DOMAIN, persistence, changesToMake),
    findEntityChanges: async (DOMAIN, changesToMake) => findEntityChanges(DOMAIN, changesToMake),
    createTopLevelElements: async (DOMAIN, persistence, changesToMake) => createTopLevelElements(DOMAIN, persistence, changesToMake)
});
