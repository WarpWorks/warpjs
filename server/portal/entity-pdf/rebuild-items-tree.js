const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const debug = require('./debug')('rebuild-items-tree');

let convertDocumentToTree;

const rebuildItemsTree = (items, level, index, deepLevelsRemaining) => {
    if (!convertDocumentToTree) {
        // Avoid cyclic import and multiple require().
        convertDocumentToTree = require('./convert-document-to-tree');
    }

    // debug(`${deepLevelsRemaining}: items=`, items);
    const cumulator = [];

    let currentSameLevelElement;

    for (let i = index; i < items.length; i++) {
        const item = items[i];

        if (item.type === constants.TYPES.COMMUNITY) {
            cumulator.push(item);
            continue;
        }

        // Here, we should only have paragraph.

        const currentLevel = parseInt(item.headingLevel.substr(1), 10);

        if (currentLevel < level) {
            // We went up level, stop.
            break;
        } else if (currentLevel === level) {
            currentSameLevelElement = warpjsUtils.createResource('', {
                type: item.type,
                id: item.id,
                position: item.position,
                headingLevel: item.headingLevel,
                heading: item.heading,
                content: item.content
            });

            if (deepLevelsRemaining) {
                if (item._embedded && item._embedded.items) {
                    // debug(`${deepLevelsRemaining}: for(): i=${i}   Need to add sub-documents.`);
                    const subDocumentResources = item._embedded.items.map((subDocument) => convertDocumentToTree(subDocument, deepLevelsRemaining - 1));
                    currentSameLevelElement.embed('items', subDocumentResources);
                }
            }

            cumulator.push(currentSameLevelElement);
        } else if (currentLevel === level + 1) {
            // Find all the elements that are consecutives, and lower than the
            // current level.
            debug(`${deepLevelsRemaining}: for(): i=${i}; currentLevel=${currentLevel}; level=${level};   Different level. item=`, item);
            const newLowerLevels = rebuildItemsTree(items, level + 1, i, deepLevelsRemaining).filter((lowerLevel) => lowerLevel.type === constants.TYPES.PARAGRAPH);
            debug(`newLowerLevels=`, newLowerLevels);
            currentSameLevelElement.embed('items', newLowerLevels);
        }
    }

    return cumulator;
};

module.exports = rebuildItemsTree;
