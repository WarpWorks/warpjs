const ChangeLogs = require('@warp-works/warpjs-change-logs');

// const debug = require('./debug')('update-data-relationship');

module.exports = async (persistence, entity, instance, body, req) => {
    const relationship = await entity.getRelationshipById(body.reference.id);

    const paragraphs = relationship ? await relationship.getDocuments(persistence, instance) : [];
    const paragraph = paragraphs.find((paragraph) => paragraph._id === body.id);

    if (paragraph) {
        const paragraphEntity = relationship.getTargetEntity();
        const basicProperty = paragraphEntity.getBasicPropertyByName(body.field);
        const enumeration = paragraphEntity.getEnumByName(body.field);

        if (basicProperty) {
            ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instance, {
                key: body.field,
                oldValue: basicProperty.getValue(paragraph),
                newValue: body.newValue
            });

            return basicProperty.setValue(paragraph, body.newValue);
        } else if (enumeration) {
            ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instance, {
                key: body.field,
                oldValue: enumeration.getValue(paragraph),
                newValue: body.newValue
            });

            return enumeration.setValue(paragraph, body.newValue);
        } else {
            throw new Error(`Invalid Field '${body.field}'`);
        }
    }
};
