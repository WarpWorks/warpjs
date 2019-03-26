const extend = require('lodash/extend');
const reduce = require('lodash/reduce');
const Promise = require('bluebird');

// const debug = require('./debug')('entity-overview');

function basicPropertiesToKeys(obj) {
    let basicProperties = reduce(
        obj.basicProperties,
        (memo, value, key) => {
            return extend(memo, {
                [value.name]: value.value
            });
        },
        {}
    );
    return Object.assign(obj, basicProperties);
}

function initResultObject(docEntity, doc) {
    return {
        type: doc.type,
        id: doc.id,
        basicProperties: docEntity.getBasicProperties().map((basicProperty) => ({
            name: basicProperty.name,
            value: doc[basicProperty.name],
            propertyType: basicProperty.propertyType
        }))
    };
}

async function extractInfo(persistence, docEntity, recursiveCount, doc) {
    if (!doc) {
        return null;
    }

    const objectWithBasicProperties = initResultObject(docEntity, doc);
    const resultObject = basicPropertiesToKeys(objectWithBasicProperties);

    if (!recursiveCount) {
        return resultObject;
    }

    return Promise.reduce(
        docEntity.getRelationships(),
        async (memo, relationship) => {
            const targetDocs = await relationship.getDocuments(persistence, doc);
            const infos = await Promise.map(
                targetDocs,
                async (targetDoc) => extractInfo(persistence, relationship.getTargetEntity(), recursiveCount - 1, targetDoc)
            );

            return extend(memo, {
                [relationship.name]: infos
            });
        },
        resultObject
    );
}

module.exports = async (persistence, instance, overviewRelationship, recursionLevel) => {
    // Recursion level:
    //  1: Image
    //  2: Map
    //  3: Target
    const docs = await overviewRelationship.getDocuments(persistence, instance);
    return Promise.map(
        docs,
        (doc) => extractInfo(persistence, overviewRelationship.getTargetEntity(), recursionLevel)
    );
};
