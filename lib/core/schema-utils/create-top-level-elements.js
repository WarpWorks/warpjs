const Promise = require('bluebird');

const createTopLevelElement = require('./create-top-level-element');

module.exports = async (DOMAIN, persistence, changesToMake) => {
    const documents = [];
    await Promise.each(
        changesToMake,
        async (changeToMake) => {
            documents.push(await createTopLevelElement(DOMAIN, persistence, changeToMake));
        }
    );

    return documents;
};
