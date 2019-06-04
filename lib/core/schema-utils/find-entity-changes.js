const Promise = require('bluebird');

const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('find-entity-changes');

module.exports = async (DOMAIN, changesToMake) => {
    const warpCore = require('./../index');

    const domain = await warpCore.getDomainByName(DOMAIN);
    const persistence = await warpCore.getPersistence(DOMAIN);

    const allChangesToMake = await Promise.reduce(
        changesToMake,
        async (memo, changeToMake) => {
            if (changeToMake.type === ComplexTypes.BasicProperty) {
                memo.push(changeToMake);
            } else if (changeToMake.type === ComplexTypes.Relationship) {
                const association = domain.getElementById(changeToMake.warpjsId);
                const reverseAssociation = association.getReverseRelationship();

                memo.push(changeToMake);

                if (reverseAssociation) {
                    memo.push({
                        type: changeToMake.type,
                        name: reverseAssociation.name,
                        position: changeToMake.position + 5,
                        target: changeToMake.sourceEntity,
                        readOnly: changeToMake.readOnly,
                        sourceEntity: changeToMake.target,
                        desc: changeToMake.reverseDesc,
                        label: changeToMake.reverseLabel,
                        reverseDesc: changeToMake.desc,
                        reverseLabel: changeToMake.label,
                        warpjsId: reverseAssociation.id
                    });
                }
            }
            return memo;
        },
        []
    );

    try {
        return Promise.reduce(
            domain.getEntities(),
            async (memo, entityInstance) => {
                // Only keep documents.
                if (!entityInstance.isDocument()) {
                    return memo;
                }

                return Promise.reduce(
                    allChangesToMake,
                    async (fieldMemo, changeToMake) => {
                        if (changeToMake.type === ComplexTypes.BasicProperty) {
                            const basicProperty = entityInstance.getBasicPropertyByName(changeToMake.name);
                            if (basicProperty) {
                                const newChangeToMake = Object.assign({}, changeToMake);
                                newChangeToMake.entityName = entityInstance.name;
                                newChangeToMake.entityId = entityInstance.id;
                                newChangeToMake.targetId = basicProperty.id;
                                fieldMemo.push(newChangeToMake);
                            }
                        } else if (changeToMake.type === ComplexTypes.Relationship) {
                            const relationship = entityInstance.getRelationshipByName(changeToMake.name);
                            if (relationship) {
                                const targetEntity = relationship.getTargetEntity();
                                if (changeToMake.target === targetEntity.name) {
                                    const newChangeToMake = Object.assign({}, changeToMake);
                                    newChangeToMake.entityName = entityInstance.name;
                                    newChangeToMake.entityId = entityInstance.id;
                                    newChangeToMake.targetId = relationship.id;
                                    fieldMemo.push(newChangeToMake);
                                } else {
                                    console.error(`Mismatch between changeToMake.target='${changeToMake.target}' and targetEntity.name='${targetEntity.name}'.`);
                                }
                            }
                        } else {
                            console.error(`Unsupported type='${changeToMake.type}'.`);
                        }
                        return fieldMemo;
                    },
                    memo
                );
            },
            []
        );
    } finally {
        persistence.close();
    }
};
