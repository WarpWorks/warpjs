const constants = require('./../constants');

module.exports = async (documentResource) => ({
    coverTitle: {
        // font: 'Oswald',
        fontSize: 28,
        color: '#000000',
        marginTop: 40,
        marginBottom: 30,
        lineHeight: 1
    },

    coverPageText: {
        // font: 'Muli',
        fontSize: 9,
        marginBottom: constants.PARAGRAPH_SPACING,
    },

    header: {
        fontSize: 22,
        bold: true
    },
    paragraph: {
        fontSize: constants.DEFAULT_FONT_SIZE,
        margin: [ 0, 0, 0, 12 ]
    },

    headline1: {
    }
});
