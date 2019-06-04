const uuid = require('uuid/v4');

const ComplexTypes = require('./../complex-types');
const createNewID = require('./create-new-id');
// const debug = require('./debug')('add-basic-property-to-basics-panel');

module.exports = async (DOMAIN, persistence, changeToMake, panelEntity, basicsPanelDocument) => {
    if (changeToMake.type !== ComplexTypes.BasicProperty) {
        // eslint-disable-next-line no-console
        console.error(`Invalid changeToMake.type='${changeToMake.type}'.`);
        return false;
    }

    let changed = false;

    const basicPropertyPanelItemRelationship = panelEntity.getRelationshipByName('basicPropertyPanelItems');
    const basicPropertyPanelItemDocuments = await basicPropertyPanelItemRelationship.getDocuments(persistence, basicsPanelDocument);

    const duplicate = basicPropertyPanelItemDocuments.find((d) => d.basicProperty === changeToMake.targetId);
    if (!duplicate) {
        // HACK walking document structure.
        let basicPropertyPanelItems = basicsPanelDocument.embedded.find((e) => e.parentRelnID === 73);
        if (!basicPropertyPanelItems) {
            basicPropertyPanelItems = {
                parentRelnID: 73,
                parentRelnName: 'basicPropertyPanelItems',
                entities: []
            };
            basicsPanelDocument.embedded.push(basicPropertyPanelItems);
        }

        const newEntity = {
            type: 'BasicPropertyPanelItem',
            warpjsId: await createNewID(DOMAIN),
            _id: uuid(),
            name: changeToMake.name,
            desc: changeToMake.desc || `Added by migration script`,
            label: changeToMake.label || changeToMake.name,
            position: changeToMake.position || 100,
            readOnly: changeToMake.readOnly,
            basicProperty: changeToMake.targetId
        };
        basicPropertyPanelItems.entities.push(newEntity);
        changed = true;
    }

    return changed;
};
