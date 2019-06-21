const warpjsUtils = require('@warp-works/warpjs-utils');

const { MAX_TOC_DEEP_LEVEL, TYPES } = require('./constants');
// const debug = require('./debug')('rebuild-items-tree');

let convertDocumentToTree;

const rebuildItemsTree = (items, level, index, tocLevel) => {
    if (!convertDocumentToTree) {
        // Avoid cyclic import and multiple require().
        convertDocumentToTree = require('./convert-document-to-tree');
    }

    const cumulator = [];

    let currentSameLevelElement;

    for (let i = index; i < items.length; i++) {
        const item = items[i];

        if (item.type === TYPES.COMMUNITY) {
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

            if (item._embedded && item._embedded.images) {
                currentSameLevelElement.embed('images', item._embedded.images);
            }

            if (tocLevel < MAX_TOC_DEEP_LEVEL) {
                if (item._embedded && item._embedded.items) {
                    const subDocumentResources = item._embedded.items.map((subDocument) => convertDocumentToTree(subDocument, tocLevel + 1));
                    currentSameLevelElement.embed('items', subDocumentResources);
                }
            }

            cumulator.push(currentSameLevelElement);
        } else if (currentLevel === level + 1) {
            if (!currentSameLevelElement) {
                // Mismatch of levels.
                continue;
            }

            // Find all the elements that are consecutives, and lower than the
            // current level.
            const childLevelElement = warpjsUtils.createResource('', {
                type: item.type,
                id: item.id,
                position: item.position,
                headingLevel: item.headingLevel,
                heading: item.heading,
                content: item.content
            });

            if (item._embedded && item._embedded.images) {
                currentSameLevelElement.embed('images', item._embedded.images);
            }

            currentSameLevelElement.embed('items', childLevelElement);

            const newLowerLevels = rebuildItemsTree(items, level + 2, i, tocLevel + 2).filter((lowerLevel) => lowerLevel.type === TYPES.PARAGRAPH);
            childLevelElement.embed('items', newLowerLevels);
        }
    }

    return cumulator;
};

module.exports = rebuildItemsTree;
