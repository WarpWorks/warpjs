const { IMAGE_TOC_NAME, TOC_NAME } = require('./../constants');

module.exports = async (documentResource) => [{
    toc: {
        id: TOC_NAME,
        title: { text: 'Contents', style: 'header' }
    },
    headlineLevel: 1,
    pageBreak: 'before'
}, {
    toc: {
        id: IMAGE_TOC_NAME,
        title: { text: 'Figures', style: 'header' }
    },
    margin: [ 0, 24, 0, 12 ]
}];
