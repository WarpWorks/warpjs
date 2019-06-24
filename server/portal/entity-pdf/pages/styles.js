const { DEFAULT_FONT_SIZE } = require('./../constants');

module.exports = async (documentResource) => ({
    header: {
        fontSize: 22,
        bold: true
    },
    paragraph: {
        fontSize: DEFAULT_FONT_SIZE,
        margin: [ 0, 0, 0, 12 ]
    }
});
