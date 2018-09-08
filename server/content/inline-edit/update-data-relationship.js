// const debug = require('debug')('W2:content:inline-edit/update-data-relationship');
const Promise = require('bluebird');

module.exports = (persistence, entity, instance, body) => Promise.resolve()
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
                    return basicProperty.setValue(paragraph, body.newValue);
                } else if (enumeration) {
                    return enumeration.setValue(paragraph, body.newValue);
                } else {
                    throw new Error(`Invalid Field '${body.field}'`);
                }
            }
        })
    )
;
