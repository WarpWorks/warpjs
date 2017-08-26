const Promise = require('bluebird');

const query = require('./query');

module.exports = ($, updatePath, updateValue, url) => {
    const data = { updatePath, updateValue };
    return Promise.resolve(query($, 'POST', data, url));
};
