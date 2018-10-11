const basicTile = require('./basic-tile');
const tile = require('./tile');
const vocabulary = require('./vocabulary');

module.exports = ($) => {
    basicTile($);
    tile($);
    vocabulary($);
};
