const isString = require('lodash/isString');
const standardPageSizes = require('pdfmake/src/standardPageSizes');

const { DEFAULT_PAGE_ORIENTATION, DEFAULT_PAGE_SIZE } = require('./../constants');

module.exports = (docDefinition) => {
    if (!docDefinition.pageSize) {
        docDefinition.pageSize = DEFAULT_PAGE_SIZE;
    }

    if (!docDefinition.pageOrientation) {
        docDefinition.pageOrientation = DEFAULT_PAGE_ORIENTATION;
    }

    if (isString(docDefinition.pageSize)) {
        const pageSize = standardPageSizes[docDefinition.pageSize] || standardPageSizes[DEFAULT_PAGE_SIZE];
        if (docDefinition.pageOrientation === 'landscape') {
            return {
                width: pageSize[1],
                height: pageSize[0]
            };
        } else {
            return {
                width: pageSize[0],
                height: pageSize[1]
            };
        }
    } else {
        return docDefinition.pageSize;
    }
};
