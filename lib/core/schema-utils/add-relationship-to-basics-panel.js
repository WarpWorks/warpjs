const uuid = require('uuid/v4');

const ComplexTypes = require('./../complex-types');
const createNewID = require('./create-new-id');
// const debug = require('./debug')('add-relationship-to-basic-panel');

module.exports = async (DOMAIN, persistence, changeToMake, panelEntity, basicsPanelDocument) => {
    if (changeToMake.type !== ComplexTypes.Relationship) {
        // eslint-disable-next-line no-console
        console.error(`Invalid changeToMake.type='${changeToMake.type}'.`);
        return false;
    }

    let changed = false;

    const relationshipPanelItemRelationship = panelEntity.getRelationshipByName('relationshipPanelItems');
    const relationshipPanelItemDocuments = await relationshipPanelItemRelationship.getDocuments(persistence, basicsPanelDocument);

    const duplicate = relationshipPanelItemDocuments.find((d) => d.relationship === changeToMake.targetId);
    if (!duplicate) {
        // HACK walking document structure.
        let relationshipPanelItems = basicsPanelDocument.embedded.find((e) => e.parentRelnID === 72);
        if (!relationshipPanelItems) {
            relationshipPanelItems = {
                parentRelnID: 72,
                parentRelnName: 'relationshipPanelItems',
                entities: []
            };
            basicsPanelDocument.embedded.push(relationshipPanelItems);
        }

        const newEntity = {
            type: 'RelationshipPanelItem',
            warpjsId: await createNewID(DOMAIN),
            _id: uuid(),
            name: changeToMake.name,
            desc: changeToMake.desc || `Added by migration script`,
            label: changeToMake.label || changeToMake.name,
            position: changeToMake.position || 100,
            readOnly: changeToMake.readOnly,
            relationship: changeToMake.targetId,
            style: 'CSV'
        };
        relationshipPanelItems.entities.push(newEntity);
        changed = true;
    }

    return changed;
};
