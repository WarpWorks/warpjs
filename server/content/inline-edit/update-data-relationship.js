const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:content:inline-edit/update-data-relationship');
const Promise = require('bluebird');

module.exports = (persistence, entity, instance, body, req) => Promise.resolve()
    .then(() => entity.getRelationshipById(body.reference.id))
    .then((relationship) => Promise.resolve()
        .then(() => relationship ? relationship.getDocuments(persistence, instance) : [])
        .then((paragraphs) => paragraphs.find((paragraph) => paragraph._id === body.id))
        .then((paragraph) => {
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
        })
    )
;
